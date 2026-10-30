import { CatalogCountry, WORLD_COUNTRIES, validateCatalog } from './catalog';
import { GameSession, StartOptions, advanceStage, answerQuestion, createSession, useHint, validId } from './core';
import { InvalidRecordError, RewardRecord, decodeRewards, decodeSession, emptyRewards, reconcileRewards, sameSession } from './persistence';

export interface SessionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type OpenOptions = Pick<StartOptions, 'playerId' | 'eligibleCountryIds' | 'stageCount'>;
export type FreshIdentity = () => { sessionId: string; seed: number };

export function storageKeys(playerId: string): { adventure: string; rewards: string } {
  if (!validId(playerId)) throw new Error('Invalid player ID');
  const prefix = `ronans:country-shape:v1:${encodeURIComponent(playerId)}`;
  return { adventure: `${prefix}:adventure`, rewards: `${prefix}:rewards` };
}

function freshIdentity(): ReturnType<FreshIdentity> {
  return { sessionId: globalThis.crypto.randomUUID(), seed: globalThis.crypto.getRandomValues(new Uint32Array(1))[0] };
}

// One writer per player/storage is required. The stale-state check protects
// sequential callers; localStorage cannot provide a cross-tab transaction.
export class GameSessionStore {
  private readonly catalog: readonly CatalogCountry[];

  constructor(
    private readonly storage: SessionStorage,
    private readonly newIdentity: FreshIdentity = freshIdentity,
    catalog = WORLD_COUNTRIES,
  ) {
    validateCatalog(catalog);
    this.catalog = catalog.map(country => ({ ...country }));
  }

  loadRewards(playerId: string): RewardRecord {
    const raw = this.storage.getItem(storageKeys(playerId).rewards);
    const rewards = raw === null ? emptyRewards(playerId) : decodeRewards(raw, this.catalog);
    if (rewards.playerId !== playerId) throw new InvalidRecordError('Reward owner mismatch');
    return rewards;
  }

  private syncRewards(session: GameSession): void {
    const before = this.loadRewards(session.playerId);
    const after = reconcileRewards(before, session);
    if (after.earned.length !== before.earned.length) {
      this.storage.setItem(storageKeys(session.playerId).rewards, JSON.stringify(after));
    }
  }

  private readAdventure(playerId: string): GameSession | null {
    const raw = this.storage.getItem(storageKeys(playerId).adventure);
    if (raw === null) return null;
    const session = decodeSession(raw, this.catalog);
    if (session.mode !== 'solo-adventure' || session.playerId !== playerId) throw new InvalidRecordError('Adventure owner or mode mismatch');
    return session;
  }

  loadAdventure(playerId: string): GameSession | null {
    const session = this.readAdventure(playerId);
    if (session) this.syncRewards(session);
    return session;
  }

  // Existing saves win, including a solved stage waiting for explicit advance.
  // Invalid saves throw and remain intact; no fallback silently resets progress.
  openAdventure(options: OpenOptions): GameSession {
    const existing = this.loadAdventure(options.playerId);
    if (existing) return existing;
    this.loadRewards(options.playerId);
    const session = createSession({ ...options, ...this.newIdentity(), mode: 'solo-adventure' }, this.catalog);
    this.storage.setItem(storageKeys(session.playerId).adventure, JSON.stringify(session));
    return session;
  }

  startExplorer(options: OpenOptions): GameSession {
    this.loadRewards(options.playerId);
    return createSession({ ...options, ...this.newIdentity(), mode: 'solo-explorer' }, this.catalog);
  }

  private transition(session: GameSession, operation: (current: GameSession) => GameSession): GameSession {
    const valid = decodeSession(JSON.stringify(session), this.catalog);
    if (valid.mode === 'solo-adventure') {
      const saved = this.readAdventure(valid.playerId);
      if (!saved || !sameSession(saved, valid)) throw new Error('Stale Adventure state; reload before continuing');
    }
    // Validate rewards before any session write, so corrupt records stay intact.
    this.loadRewards(valid.playerId);
    const next = operation(valid);
    if (next.mode === 'solo-adventure' && !sameSession(valid, next)) {
      // Persist the completion first. If the reward write fails, loadAdventure
      // replays earned rewards from completed stages without awarding twice.
      this.storage.setItem(storageKeys(next.playerId).adventure, JSON.stringify(next));
    }
    this.syncRewards(next);
    return next;
  }

  answer(session: GameSession, answerId: string): GameSession {
    return this.transition(session, current => answerQuestion(current, answerId));
  }

  hint(session: GameSession): GameSession {
    return this.transition(session, current => useHint(current));
  }

  advance(session: GameSession): GameSession {
    return this.transition(session, current => advanceStage(current, this.catalog));
  }
}
