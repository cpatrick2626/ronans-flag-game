import { CatalogCountry, WORLD_COUNTRIES, catalogIdentity, validateCatalog } from './catalog';
import { isSeed, shuffled } from './random';

export type SoloMode = 'solo-adventure' | 'solo-explorer';
export type RewardMode = SoloMode | 'co-op' | 'battle';
export const MAX_STAGES = 1000;

export interface Question {
  countryId: string;
  answerIds: string[];
  solved: boolean;
  mistakes: number;
  hints: number;
}

export interface CompletedStage {
  stage: number;
  countryId: string;
  answerIds: string[];
  mistakes: number;
  hints: number;
}

export interface GameSession {
  schemaVersion: 1;
  game: 'country-shape';
  catalogIdentity: string;
  sessionId: string;
  playerId: string;
  mode: SoloMode;
  seed: number;
  eligibleCountryIds: string[];
  stageCount: number;
  currentStage: number;
  revision: number;
  rngState: number;
  remainingCountryIds: string[];
  question: Question;
  completedStages: CompletedStage[];
}

export interface StartOptions {
  sessionId: string;
  playerId: string;
  mode: SoloMode;
  seed: number;
  eligibleCountryIds: readonly string[];
  stageCount?: number;
}

export function validId(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 200;
}

export function isCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

function generateQuestion(session: GameSession, catalog: readonly CatalogCountry[]): void {
  const state = { value: session.rngState };
  if (!session.remainingCountryIds.length) {
    session.remainingCountryIds = shuffled(session.eligibleCountryIds, state);
  }
  const countryId = session.remainingCountryIds.shift()!;
  const wrongIds = shuffled(catalog.filter(country => country.id !== countryId).map(country => country.id), state).slice(0, 3);
  session.question = { countryId, answerIds: shuffled([countryId, ...wrongIds], state), solved: false, mistakes: 0, hints: 0 };
  session.rngState = state.value;
}

export function createSession(options: StartOptions, catalog = WORLD_COUNTRIES): GameSession {
  validateCatalog(catalog);
  if (!validId(options.sessionId) || !validId(options.playerId)) throw new Error('Invalid session or player ID');
  if (options.mode !== 'solo-adventure' && options.mode !== 'solo-explorer') throw new Error('Unsupported solo mode');
  if (!isSeed(options.seed)) throw new Error('Seed must be a uint32');
  const ids = options.eligibleCountryIds;
  const catalogIds = new Set(catalog.map(country => country.id));
  if (!ids.length || new Set(ids).size !== ids.length || ids.some(id => !catalogIds.has(id))) {
    throw new Error('Eligible IDs must be a nonempty unique catalog subset');
  }
  const stageCount = options.stageCount ?? ids.length;
  if (!Number.isInteger(stageCount) || stageCount < 1 || stageCount > MAX_STAGES) throw new Error('Invalid stage count');
  const session: GameSession = {
    schemaVersion: 1, game: 'country-shape', catalogIdentity: catalogIdentity(catalog),
    sessionId: options.sessionId, playerId: options.playerId, mode: options.mode, seed: options.seed,
    eligibleCountryIds: [...ids], stageCount, currentStage: 1, revision: 0,
    rngState: options.seed, remainingCountryIds: [],
    question: { countryId: '', answerIds: [], solved: false, mistakes: 0, hints: 0 }, completedStages: [],
  };
  generateQuestion(session, catalog);
  return session;
}

function copySession(session: GameSession): GameSession {
  return {
    ...session, eligibleCountryIds: [...session.eligibleCountryIds], remainingCountryIds: [...session.remainingCountryIds],
    question: { ...session.question, answerIds: [...session.question.answerIds] },
    completedStages: session.completedStages.map(stage => ({ ...stage, answerIds: [...stage.answerIds] })),
  };
}

function incrementRevision(session: GameSession): void {
  if (session.revision >= Number.MAX_SAFE_INTEGER) throw new Error('Session counter limit reached');
  session.revision++;
}

export function answerQuestion(session: GameSession, answerId: string): GameSession {
  if (!session.question.answerIds.includes(answerId)) throw new Error('Answer is not an offered option');
  if (session.question.solved) return copySession(session);
  const next = copySession(session);
  incrementRevision(next);
  if (answerId !== next.question.countryId) {
    next.question.mistakes++;
  } else {
    next.question.solved = true;
    const { countryId, answerIds, mistakes, hints } = next.question;
    next.completedStages.push({ stage: next.currentStage, countryId, answerIds: [...answerIds], mistakes, hints });
  }
  return next;
}

// The UI chooses the hint presentation. This core records its use only.
export function useHint(session: GameSession): GameSession {
  if (session.question.solved) throw new Error('Challenge is already solved');
  const next = copySession(session);
  incrementRevision(next);
  next.question.hints++;
  return next;
}

export function isSessionComplete(session: GameSession): boolean {
  return session.currentStage === session.stageCount && session.question.solved;
}

export function advanceStage(session: GameSession, catalog = WORLD_COUNTRIES): GameSession {
  if (!session.question.solved) throw new Error('Finish the current challenge before advancing');
  if (isSessionComplete(session)) return copySession(session);
  if (session.catalogIdentity !== catalogIdentity(catalog)) throw new Error('Catalog changed');
  const next = copySession(session);
  next.currentStage++;
  incrementRevision(next);
  generateQuestion(next, catalog);
  return next;
}

export function sessionStats(session: GameSession): { mistakes: number; hints: number; completedStages: number } {
  return {
    mistakes: session.completedStages.reduce((sum, stage) => sum + stage.mistakes, session.question.solved ? 0 : session.question.mistakes),
    hints: session.completedStages.reduce((sum, stage) => sum + stage.hints, session.question.solved ? 0 : session.question.hints),
    completedStages: session.completedStages.length,
  };
}
