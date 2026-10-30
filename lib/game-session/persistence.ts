import { CatalogCountry, WORLD_COUNTRIES } from './catalog';
import {
  GameSession, MAX_STAGES, RewardMode, answerQuestion, advanceStage, createSession, isCount, validId,
} from './core';

export class InvalidRecordError extends Error {
  constructor(message: string, public readonly code: 'invalid' | 'unsupported-version' = 'invalid') {
    super(message);
    this.name = 'InvalidRecordError';
  }
}

export interface RewardSource {
  game: 'country-shape';
  mode: RewardMode;
  sessionId: string;
  stage: number;
}

export interface RewardRecord {
  schemaVersion: 1;
  playerId: string;
  earned: { countryId: string; source: RewardSource }[];
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parse(raw: string): Record<string, unknown> {
  if (raw.length > 2_000_000) throw new InvalidRecordError('Record is too large');
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new InvalidRecordError('Malformed JSON'); }
  if (!record(value)) throw new InvalidRecordError('Expected a record');
  if (value.schemaVersion !== 1) throw new InvalidRecordError('Unsupported schema version', 'unsupported-version');
  return value;
}

// Compare structure rather than JSON key order; unknown fields fail validation.
function sameData(left: unknown, right: unknown, depth = 0): boolean {
  if (depth > 10) return false;
  if (left === right) return true;
  if (Array.isArray(left)) {
    return Array.isArray(right) && left.length === right.length && left.every((value, index) => sameData(value, right[index], depth + 1));
  }
  if (record(left) && record(right)) {
    const keys = Object.keys(left);
    return keys.length === Object.keys(right).length && keys.every(key => Object.hasOwn(right, key) && sameData(left[key], right[key], depth + 1));
  }
  return false;
}

export function sameSession(left: GameSession, right: GameSession): boolean {
  return sameData(left, right);
}

export function decodeSession(raw: string, catalog = WORLD_COUNTRIES): GameSession {
  const value = parse(raw);
  try {
    if (!validId(value.sessionId) || !validId(value.playerId) ||
        (value.mode !== 'solo-adventure' && value.mode !== 'solo-explorer') ||
        !Array.isArray(value.eligibleCountryIds) || !value.eligibleCountryIds.every(id => typeof id === 'string') ||
        !isCount(value.currentStage) || value.currentStage < 1 || value.currentStage > MAX_STAGES ||
        !isCount(value.stageCount) || !Array.isArray(value.completedStages) ||
        !record(value.question) || typeof value.question.solved !== 'boolean') {
      throw new Error('Invalid session fields');
    }
    let expected = createSession({
      sessionId: value.sessionId, playerId: value.playerId, mode: value.mode,
      seed: value.seed as number, eligibleCountryIds: value.eligibleCountryIds, stageCount: value.stageCount,
    }, catalog);
    const completedCount = value.currentStage - (value.question.solved ? 0 : 1);
    if (value.completedStages.length !== completedCount) throw new Error('Invalid completed stages');
    for (let stage = 1; stage <= value.currentStage; stage++) {
      const counters = stage <= completedCount ? value.completedStages[stage - 1] : value.question;
      if (!record(counters) || !isCount(counters.mistakes) || !isCount(counters.hints)) throw new Error('Invalid counters');
      expected.question.mistakes = counters.mistakes;
      expected.question.hints = counters.hints;
      expected.revision += counters.mistakes + counters.hints;
      if (stage <= completedCount) expected = answerQuestion(expected, expected.question.countryId);
      if (stage < value.currentStage) expected = advanceStage(expected, catalog);
    }
    if (!isCount(expected.revision) || !sameData(expected, value)) throw new Error('Session invariants do not match seeded replay');
    return expected;
  } catch (error) {
    throw new InvalidRecordError(error instanceof Error ? error.message : 'Invalid session');
  }
}

export function emptyRewards(playerId: string): RewardRecord {
  if (!validId(playerId)) throw new Error('Invalid player ID');
  return { schemaVersion: 1, playerId, earned: [] };
}

export function decodeRewards(raw: string, catalog = WORLD_COUNTRIES): RewardRecord {
  const value = parse(raw);
  if (!validId(value.playerId) || !Array.isArray(value.earned) || value.earned.length > catalog.length) {
    throw new InvalidRecordError('Invalid rewards');
  }
  const expected = emptyRewards(value.playerId);
  const ids = new Set(catalog.map(country => country.id));
  const modes: RewardMode[] = ['solo-adventure', 'solo-explorer', 'co-op', 'battle'];
  for (const earned of value.earned) {
    if (!record(earned) || typeof earned.countryId !== 'string' || !ids.delete(earned.countryId) || !record(earned.source)) {
      throw new InvalidRecordError('Invalid or duplicate earned country');
    }
    const source = earned.source;
    if (source.game !== 'country-shape' || !modes.includes(source.mode as RewardMode) ||
        !validId(source.sessionId) || !isCount(source.stage) || source.stage < 1 || source.stage > MAX_STAGES) {
      throw new InvalidRecordError('Invalid reward source');
    }
    expected.earned.push({ countryId: earned.countryId, source: {
      game: 'country-shape', mode: source.mode as RewardMode, sessionId: source.sessionId, stage: source.stage,
    } });
  }
  if (!sameData(value, expected)) throw new InvalidRecordError('Unexpected reward fields');
  return expected;
}

// A permanent country reward is earned once across sessions and modes. No XP,
// legacy stamps, or visual reward policy is introduced by this foundation.
export function reconcileRewards(rewards: RewardRecord, session: GameSession): RewardRecord {
  if (rewards.playerId !== session.playerId) throw new Error('Reward owner mismatch');
  const next: RewardRecord = { ...rewards, earned: rewards.earned.map(earned => ({ ...earned, source: { ...earned.source } })) };
  const earnedIds = new Set(next.earned.map(earned => earned.countryId));
  for (const stage of session.completedStages) {
    if (!earnedIds.has(stage.countryId)) {
      earnedIds.add(stage.countryId);
      next.earned.push({ countryId: stage.countryId, source: {
        game: 'country-shape', mode: session.mode, sessionId: session.sessionId, stage: stage.stage,
      } });
    }
  }
  return next;
}
