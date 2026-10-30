import { test, expect } from '@playwright/test';
import {
  WORLD_COUNTRIES, GameSessionStore, InvalidRecordError, MAX_STAGES,
  advanceStage, answerQuestion, createSession, decodeRewards, decodeSession,
  emptyRewards, isSessionComplete, reconcileRewards, sessionStats, storageKeys, useHint,
} from '../lib/game-session';
import type { GameSession, OpenOptions, SessionStorage, StartOptions } from '../lib/game-session';
import { random } from '../lib/game-session/random';

const eligible = ['france', 'italy', 'central-african-republic', 'japan', 'brazil'];
const defaults: StartOptions = { playerId: 'player-1', sessionId: 'session-1', mode: 'solo-adventure', seed: 1, eligibleCountryIds: eligible };
const options: OpenOptions = { playerId: defaults.playerId, eligibleCountryIds: eligible };
const start = (overrides: Partial<StartOptions> = {}) => createSession({ ...defaults, ...overrides });
const wrong = (session: GameSession) => session.question.answerIds.find(id => id !== session.question.countryId)!;
const solve = (session: GameSession) => answerQuestion(session, session.question.countryId);

class MemoryStorage implements SessionStorage {
  data = new Map<string, string>();
  writes: string[] = [];
  failKey: string | null = null;
  failRead = false;
  getItem(key: string): string | null {
    if (this.failRead) throw new Error('Storage unavailable');
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    if (key === this.failKey) throw new Error('Storage quota failure');
    this.writes.push(key);
    this.data.set(key, value);
  }
}

function makeStore(storage = new MemoryStorage()) {
  let counter = 0;
  const store = new GameSessionStore(storage, () => ({ sessionId: `fresh-${++counter}`, seed: counter }));
  return { storage, store };
}

test('uses the existing 194-country catalog without adding playable countries', () => {
  expect(WORLD_COUNTRIES).toHaveLength(194);
  expect(new Set(WORLD_COUNTRIES.map(country => country.id)).size).toBe(194);
  expect(new Set(WORLD_COUNTRIES.map(country => country.name)).size).toBe(194);
  expect(Object.isFrozen(WORLD_COUNTRIES)).toBe(true);
});

test('seeded random stream has a fixed reference sequence, including seed zero', () => {
  const state = { value: 1 };
  expect(Array.from({ length: 4 }, () => random(state))).toEqual([
    0.6270739405881613, 0.002735721180215478, 0.5274470399599522, 0.9810509674716741,
  ]);
  expect(start({ seed: 0 })).toEqual(start({ seed: 0 }));
});

test('100 seeds preserve selection, answer uniqueness, exhaustion, and all answer positions', () => {
  const positions = new Set<number>();
  const arrangements = new Set<string>();
  const firstTargets = new Set<string>();
  for (let seed = 0; seed < 100; seed++) {
    let session = start({ seed, stageCount: eligible.length * 3 });
    const targets: string[] = [];
    for (let stage = 1; stage <= session.stageCount; stage++) {
      const { countryId, answerIds } = session.question;
      targets.push(countryId);
      expect(eligible).toContain(countryId);
      expect(answerIds).toHaveLength(4);
      expect(new Set(answerIds).size).toBe(4);
      expect(answerIds.filter(id => id === countryId)).toHaveLength(1);
      expect(answerIds.every(id => WORLD_COUNTRIES.some(country => country.id === id))).toBe(true);
      positions.add(answerIds.indexOf(countryId));
      arrangements.add(answerIds.join(','));
      if (stage === 1) firstTargets.add(countryId);
      session = advanceStage(solve(session));
    }
    for (let index = 0; index < targets.length; index += eligible.length) {
      expect([...targets.slice(index, index + eligible.length)].sort()).toEqual([...eligible].sort());
    }
    expect(isSessionComplete(session)).toBe(true);
  }
  expect(positions.size).toBe(4);
  expect(firstTargets.size).toBe(eligible.length);
  expect(arrangements.size).toBeGreaterThan(100);
});

test('worldwide targets are not repeated before all 194 have been selected', () => {
  let session = start({ eligibleCountryIds: WORLD_COUNTRIES.map(country => country.id), stageCount: 388 });
  const targets: string[] = [];
  for (let stage = 0; stage < 388; stage++) {
    targets.push(session.question.countryId);
    session = advanceStage(solve(session));
  }
  expect(new Set(targets.slice(0, 194)).size).toBe(194);
  expect(new Set(targets.slice(194)).size).toBe(194);
});

test('a single eligible target still draws distractors from the full worldwide catalog', () => {
  const wrongIds = new Set<string>();
  for (let seed = 0; seed < 1200; seed++) {
    const session = start({ seed, eligibleCountryIds: ['central-african-republic'] });
    session.question.answerIds.filter(id => id !== session.question.countryId).forEach(id => wrongIds.add(id));
  }
  expect(wrongIds.size).toBe(WORLD_COUNTRIES.length - 1);
  expect(wrongIds.has('central-african-republic')).toBe(false);
});

test('identical seeds and actions produce identical questions and continuation', () => {
  let left = start({ stageCount: 15 });
  let right = start({ stageCount: 15 });
  for (let stage = 0; stage < 15; stage++) {
    left = advanceStage(solve(useHint(answerQuestion(left, wrong(left)))));
    right = advanceStage(solve(useHint(answerQuestion(right, wrong(right)))));
    expect(left).toEqual(right);
  }
});

for (const [name, overrides] of [
  ['empty pool', { eligibleCountryIds: [] }],
  ['duplicate pool', { eligibleCountryIds: ['france', 'france'] }],
  ['unknown country', { eligibleCountryIds: ['invented-country'] }],
  ['negative seed', { seed: -1 }],
  ['fractional seed', { seed: 1.5 }],
  ['overflow seed', { seed: 0x100000000 }],
  ['empty player', { playerId: '' }],
  ['empty session', { sessionId: ' ' }],
  ['zero stages', { stageCount: 0 }],
  ['too many stages', { stageCount: MAX_STAGES + 1 }],
] as [string, Partial<StartOptions>][]) {
  test(`rejects invalid start: ${name}`, () => expect(() => start(overrides)).toThrow());
}

test('rejects insufficient or duplicate custom catalogs', () => {
  expect(() => createSession(defaults, WORLD_COUNTRIES.slice(0, 3))).toThrow();
  expect(() => createSession(defaults, [WORLD_COUNTRIES[0], WORLD_COUNTRIES[0], ...WORLD_COUNTRIES])).toThrow();
});

test('wrong answers and hints leave question and RNG unchanged; totals count once', () => {
  const initial = start();
  const before = JSON.stringify(initial);
  const mistaken = answerQuestion(initial, wrong(initial));
  const hinted = useHint(mistaken);
  const solved = solve(hinted);
  expect(JSON.stringify(initial)).toBe(before);
  expect(hinted.question.answerIds).toEqual(initial.question.answerIds);
  expect(hinted.rngState).toBe(initial.rngState);
  expect(sessionStats(hinted)).toEqual({ mistakes: 1, hints: 1, completedStages: 0 });
  expect(sessionStats(solved)).toEqual({ mistakes: 1, hints: 1, completedStages: 1 });
  expect(solve(solved)).toEqual(solved);
  expect(() => useHint(solved)).toThrow();
  expect(() => answerQuestion(initial, 'not-an-answer')).toThrow();
  expect(() => advanceStage(initial)).toThrow();
  const next = advanceStage(solved);
  expect(next.question.mistakes).toBe(0);
  expect(next.question.hints).toBe(0);
  expect(sessionStats(next)).toEqual({ mistakes: 1, hints: 1, completedStages: 1 });
});

test('stage completion waits for explicit advance and final advance is idempotent', () => {
  const one = start({ stageCount: 1 });
  const completed = solve(one);
  expect(completed.currentStage).toBe(1);
  expect(isSessionComplete(one)).toBe(false);
  expect(isSessionComplete(completed)).toBe(true);
  expect(advanceStage(completed)).toEqual(completed);
});

test('counter limits cannot produce an unloadable save or overwrite progress', () => {
  const session = start();
  session.question.mistakes = Number.MAX_SAFE_INTEGER;
  session.revision = Number.MAX_SAFE_INTEGER;
  expect(decodeSession(JSON.stringify(session))).toEqual(session);
  expect(() => useHint(session)).toThrow('counter limit');
  expect(() => answerQuestion(session, wrong(session))).toThrow('counter limit');
  expect(() => solve(session)).toThrow('counter limit');
  const { storage, store } = makeStore();
  const raw = JSON.stringify(session);
  storage.data.set(storageKeys(options.playerId).adventure, raw);
  expect(() => store.hint(session)).toThrow('counter limit');
  expect(storage.data.get(storageKeys(options.playerId).adventure)).toBe(raw);
  expect(storage.writes).toEqual([]);
});

test('Adventure resumes exact unfinished challenge, counters, history, and subsequent stream', () => {
  const { storage, store } = makeStore();
  let session = store.openAdventure(options);
  session = store.answer(session, session.question.countryId);
  session = store.advance(session);
  session = store.hint(store.answer(session, wrong(session)));
  const resumedStore = new GameSessionStore(storage);
  const resumed = resumedStore.openAdventure({ ...options, eligibleCountryIds: ['italy'] });
  expect(resumed).toEqual(session);
  expect(resumed.question.solved).toBe(false);
  const afterResume = resumedStore.advance(resumedStore.answer(resumed, resumed.question.countryId));
  expect(afterResume).toEqual(advanceStage(solve(session)));
});

test('Adventure re-entry at every transition, including solved and exhausted-pool boundaries', () => {
  const { storage, store } = makeStore();
  let session = store.openAdventure({ ...options, stageCount: 12 });
  for (let stage = 0; stage < 12; stage++) {
    session = store.answer(session, wrong(session));
    expect(new GameSessionStore(storage).loadAdventure(options.playerId)).toEqual(session);
    session = store.hint(session);
    expect(new GameSessionStore(storage).loadAdventure(options.playerId)).toEqual(session);
    session = store.answer(session, session.question.countryId);
    expect(new GameSessionStore(storage).loadAdventure(options.playerId)).toEqual(session);
    session = store.advance(session);
    expect(new GameSessionStore(storage).loadAdventure(options.playerId)).toEqual(session);
  }
  expect(isSessionComplete(session)).toBe(true);
});

test('Explorer starts fresh, never persists stages, and preserves rewards and Adventure bytes', () => {
  const { storage, store } = makeStore();
  const adventure = store.openAdventure(options);
  const adventureBytes = storage.data.get(storageKeys(options.playerId).adventure);
  const first = store.startExplorer(options);
  const completed = store.answer(first, first.question.countryId);
  const rewards = store.loadRewards(options.playerId);
  expect(rewards.earned.map(earned => earned.countryId)).toEqual([first.question.countryId]);
  store.advance(completed);
  const second = store.startExplorer(options);
  expect(second.currentStage).toBe(1);
  expect(second.completedStages).toEqual([]);
  expect(second.sessionId).not.toBe(first.sessionId);
  expect(second.seed).not.toBe(first.seed);
  expect(second.question.answerIds).not.toEqual(first.question.answerIds);
  expect(storage.data.get(storageKeys(options.playerId).adventure)).toBe(adventureBytes);
  expect(store.loadAdventure(options.playerId)).toEqual(adventure);
  expect(new GameSessionStore(storage).loadRewards(options.playerId)).toEqual(rewards);
  expect([...storage.data.keys()].sort()).toEqual(Object.values(storageKeys(options.playerId)).sort());
});

test('Explorer alone writes no session record, even after hints, mistakes, and completion', () => {
  const { storage, store } = makeStore();
  let session = store.startExplorer({ ...options, stageCount: 1 });
  expect(storage.writes).toEqual([]);
  session = store.hint(store.answer(session, wrong(session)));
  session = store.answer(session, session.question.countryId);
  store.advance(session);
  expect(storage.writes).toEqual([storageKeys(options.playerId).rewards]);
  expect(store.loadAdventure(options.playerId)).toBeNull();
});

test('rewards are idempotent across repeated answers, stages, modes, and restarts', () => {
  const { storage, store } = makeStore();
  const single = { ...options, eligibleCountryIds: ['france'], stageCount: 2 };
  let session = store.openAdventure(single);
  session = store.answer(session, 'france');
  session = store.answer(session, 'france');
  session = store.advance(session);
  session = store.answer(session, 'france');
  const explorer = store.startExplorer(single);
  store.answer(explorer, 'france');
  const restarted = new GameSessionStore(storage);
  restarted.loadAdventure(options.playerId);
  expect(restarted.loadRewards(options.playerId).earned).toEqual([{
    countryId: 'france', source: { game: 'country-shape', mode: 'solo-adventure', sessionId: session.sessionId, stage: 1 },
  }]);
  expect(storage.writes.filter(key => key.endsWith(':rewards'))).toHaveLength(1);
});

test('interruption after Adventure completion write recovers missing reward on re-entry', () => {
  const { storage, store } = makeStore();
  const session = store.openAdventure(options);
  storage.failKey = storageKeys(options.playerId).rewards;
  expect(() => store.answer(session, session.question.countryId)).toThrow('Storage quota failure');
  expect(JSON.parse(storage.data.get(storageKeys(options.playerId).adventure)!).question.solved).toBe(true);
  storage.failKey = null;
  const restarted = new GameSessionStore(storage);
  const resumed = restarted.loadAdventure(options.playerId)!;
  expect(resumed.question.solved).toBe(true);
  expect(restarted.loadRewards(options.playerId).earned).toHaveLength(1);
  restarted.loadAdventure(options.playerId);
  expect(restarted.loadRewards(options.playerId).earned).toHaveLength(1);
});

test('failed Adventure write leaves the prior question and rewards untouched', () => {
  const { storage, store } = makeStore();
  const session = store.openAdventure(options);
  const bytes = storage.data.get(storageKeys(options.playerId).adventure);
  storage.failKey = storageKeys(options.playerId).adventure;
  expect(() => store.answer(session, session.question.countryId)).toThrow();
  expect(storage.data.get(storageKeys(options.playerId).adventure)).toBe(bytes);
  expect(store.loadRewards(options.playerId).earned).toEqual([]);
});

test('Explorer reward write failure can be retried without duplicate earnings', () => {
  const { storage, store } = makeStore();
  const session = store.startExplorer(options);
  storage.failKey = storageKeys(options.playerId).rewards;
  expect(() => store.answer(session, session.question.countryId)).toThrow();
  expect(session.question.solved).toBe(false);
  storage.failKey = null;
  const solved = store.answer(session, session.question.countryId);
  store.answer(solved, solved.question.countryId);
  expect(store.loadRewards(options.playerId).earned).toHaveLength(1);
});

test('stale Adventure snapshots cannot overwrite newer progress', () => {
  const { store } = makeStore();
  const session = store.openAdventure(options);
  const next = store.hint(session);
  expect(() => store.answer(session, session.question.countryId)).toThrow('Stale Adventure');
  expect(store.loadAdventure(options.playerId)).toEqual(next);
});

test('storage read failures propagate without fallback or writes', () => {
  const { storage, store } = makeStore();
  storage.failRead = true;
  expect(() => store.openAdventure(options)).toThrow('Storage unavailable');
  expect(() => store.startExplorer(options)).toThrow('Storage unavailable');
  expect(storage.writes).toEqual([]);
});

test('preserves every legacy/unrelated storage value and isolates player records', () => {
  const { storage, store } = makeStore();
  const legacy = new Map([
    ['flag_progression_v1', '{"xp":987,"countries":{"FR":{"completed":true}}}'],
    ['banana_progression_v1', 'original legacy bytes'],
    ['playerName', 'Ronan'], ['unrelated', '{broken-json'],
  ]);
  legacy.forEach((value, key) => storage.data.set(key, value));
  let first = store.openAdventure(options);
  first = store.answer(first, first.question.countryId);
  store.openAdventure({ ...options, playerId: 'player-2' });
  const secondExplorer = store.startExplorer({ ...options, playerId: 'player-2' });
  store.answer(secondExplorer, secondExplorer.question.countryId);
  legacy.forEach((value, key) => expect(storage.data.get(key)).toBe(value));
  expect(store.loadAdventure(options.playerId)).toEqual(first);
  expect(store.loadRewards('player-2').earned).toHaveLength(1);
  expect(storageKeys('a:b').adventure).not.toBe(storageKeys('a%3Ab').adventure);
});

const corruptions: [string, (value: any) => void][] = [
  ['unknown version', value => { value.schemaVersion = 99; }],
  ['wrong game', value => { value.game = 'flag-color'; }],
  ['unknown mode', value => { value.mode = 'battle'; }],
  ['catalog drift', value => { value.catalogIdentity = 'changed'; }],
  ['unknown target', value => { value.question.countryId = 'unknown'; }],
  ['duplicate answers', value => { value.question.answerIds.fill(value.question.countryId); }],
  ['answer rearrangement', value => { value.question.answerIds.reverse(); }],
  ['negative mistakes', value => { value.question.mistakes = -1; }],
  ['fractional hints', value => { value.question.hints = 0.5; }],
  ['counter overflow', value => { value.question.hints = Number.MAX_SAFE_INTEGER + 1; }],
  ['impossible stage', value => { value.currentStage = 1001; }],
  ['stage exceeds goal', value => { value.stageCount = 1; value.currentStage = 2; }],
  ['missing completions', value => { value.question.solved = true; }],
  ['false completion', value => { value.completedStages.push({ stage: 1 }); }],
  ['invalid RNG', value => { value.rngState = 42; }],
  ['pool tampering', value => { value.remainingCountryIds = []; }],
  ['revision tampering', value => { value.revision = 9; }],
  ['unknown field', value => { value.surprise = true; }],
];

for (const [name, corrupt] of corruptions) {
  test(`invalid Adventure is rejected and preserved: ${name}`, () => {
    const { storage, store } = makeStore();
    const value = JSON.parse(JSON.stringify(start()));
    corrupt(value);
    const bytes = JSON.stringify(value);
    storage.data.set(storageKeys(options.playerId).adventure, bytes);
    expect(() => store.openAdventure(options)).toThrow(InvalidRecordError);
    expect(storage.data.get(storageKeys(options.playerId).adventure)).toBe(bytes);
    expect(storage.writes).toEqual([]);
  });
}

for (const raw of ['{', 'null', '[]', 'false', '{}', '"text"', '{"schemaVersion":1}']) {
  test(`malformed/incomplete save fails closed: ${raw}`, () => {
    expect(() => decodeSession(raw)).toThrow(InvalidRecordError);
  });
}

test('version errors are distinguishable and key order does not affect valid saves', () => {
  try { decodeSession('{"schemaVersion":2}'); } catch (error) {
    expect(error).toBeInstanceOf(InvalidRecordError);
    expect((error as InvalidRecordError).code).toBe('unsupported-version');
  }
  const session = useHint(start());
  const reordered = Object.fromEntries(Object.entries(session).reverse());
  expect(decodeSession(JSON.stringify(reordered))).toEqual(session);
});

test('completed-stage tampering is rejected', () => {
  const session = advanceStage(solve(start()));
  const value = JSON.parse(JSON.stringify(session));
  value.completedStages[0].answerIds.reverse();
  expect(() => decodeSession(JSON.stringify(value))).toThrow(InvalidRecordError);
});

test('wrong owner/mode records and corrupt rewards never reset existing data', () => {
  const { storage, store } = makeStore();
  const key = storageKeys(options.playerId).adventure;
  storage.data.set(key, JSON.stringify(start({ playerId: 'someone-else' })));
  expect(() => store.loadAdventure(options.playerId)).toThrow('owner');
  storage.data.set(key, JSON.stringify(start({ mode: 'solo-explorer' })));
  expect(() => store.loadAdventure(options.playerId)).toThrow('mode');
  storage.data.delete(key);
  storage.data.set(storageKeys(options.playerId).rewards, '{corrupt');
  expect(() => store.openAdventure(options)).toThrow(InvalidRecordError);
  expect(() => store.startExplorer(options)).toThrow(InvalidRecordError);
  expect(storage.writes).toEqual([]);
  expect(storage.data.has(key)).toBe(false);
});

test('reward validation rejects duplicates, wrong ownership, invalid sources, and future versions', () => {
  const rewards = reconcileRewards(emptyRewards(options.playerId), solve(start()));
  expect(decodeRewards(JSON.stringify(rewards))).toEqual(rewards);
  const duplicate = { ...rewards, earned: [...rewards.earned, ...rewards.earned] };
  expect(() => decodeRewards(JSON.stringify(duplicate))).toThrow();
  expect(() => decodeRewards(JSON.stringify({ ...rewards, schemaVersion: 2 }))).toThrow();
  expect(() => decodeRewards(JSON.stringify({ ...rewards, earned: [{ countryId: 'unknown', source: rewards.earned[0].source }] }))).toThrow();
  expect(() => decodeRewards(JSON.stringify({ ...rewards, earned: [{ ...rewards.earned[0], source: { ...rewards.earned[0].source, stage: 0 } }] }))).toThrow();
  expect(() => reconcileRewards(emptyRewards('other'), solve(start()))).toThrow('owner');
  const { storage, store } = makeStore();
  storage.data.set(storageKeys(options.playerId).rewards, JSON.stringify({ ...rewards, playerId: 'other' }));
  expect(() => store.loadRewards(options.playerId)).toThrow('owner');
});

test('default Explorer entropy creates a new identity on each fresh start', () => {
  const store = new GameSessionStore(new MemoryStorage());
  const first = store.startExplorer(options);
  const second = store.startExplorer(options);
  expect(first.sessionId).not.toBe(second.sessionId);
});
