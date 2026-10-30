# Game Session Core v1

This module manages Country Shape questions and progress. It imports the 194 records in `public/countries.js`. It does not add screens, shape geometry, assets, navigation, or a reward display.

## Integration contract

Import from `lib/game-session`. Pass a storage object with synchronous `getItem` and `setItem` methods. Construction and module imports have no storage side effects. Browser callers can explicitly pass `window.localStorage`; tests use memory storage.

```ts
const store = new GameSessionStore(window.localStorage);
const adventure = store.openAdventure({
  playerId: 'stable-player-id',
  eligibleCountryIds: ['central-african-republic'],
  stageCount: 1,
});
const hinted = store.hint(adventure);
const answered = store.answer(hinted, selectedCountryId);
// After the celebration, advance explicitly:
const next = answered.question.solved ? store.advance(answered) : answered;
```

The caller supplies eligible target IDs after verifying that its presentation supports those countries. No geometry readiness is inferred from flag metadata. The core rejects unknown, empty, or duplicate target IDs. Distractors always come from the full worldwide catalog, independently of target eligibility. A stage is one shape question. Stage counts range from 1 to 1000 and default to the eligible pool size.

Each pool cycle is shuffled without replacement. A new cycle begins only after every eligible country has been selected. Repetition at a cycle boundary is allowed. Every question gets three distinct wrong answers and a fresh shuffle of four answer positions; consecutive positions or arrangements can coincide by chance. Mistakes and hint use do not regenerate the question. Hint presentation belongs to the caller.

Use `sessionStats(session)` for total mistakes, hints, and completed-stage count. Correct answers mark a stage complete once. The solved question remains current until `advance` is called. Advancing the final solved stage returns the completed session unchanged.

## Adventure and Explorer

`openAdventure` resumes an existing valid save, including its question, answer order, counters, completed stages, and remaining shuffle pool. Existing saved settings win over new start options. Completed Adventures remain saved; replacing or deleting them requires a future explicit product decision. `loadAdventure(playerId)` returns `null` when there is no save.

`startExplorer` creates an in-memory session with a fresh cryptographic seed and UUID on each call. It never loads, writes, or removes Adventure progression. Earned country rewards persist across both solo modes. A fresh session is randomized; randomness does not guarantee a different first question every time. Tests can inject a deterministic identity factory through the store constructor.

Pure functions such as `createSession`, `answerQuestion`, `useHint`, and `advanceStage` return detached state and perform no I/O. They expect engine-created or decoded sessions. Use store methods for durable Adventure transitions and rewards.

## Persistence and rewards

Records use schema version 1 and player-specific keys returned by `storageKeys(playerId)`:

```text
ronans:country-shape:v1:<encoded-player-id>:adventure
ronans:country-shape:v1:<encoded-player-id>:rewards
```

The module does not read, migrate, clear, or write `flag_progression_v1`, `banana_progression_v1`, player names, or any unrelated key. It has no default storage binding. No XP or existing passport/stamp policy is changed. A reward is a permanent earned-country record, granted once per player across sessions and modes. Reward sources retain game, mode, session ID, and stage. Source types reserve Co-op and Battle values; those modes have no session implementation here.

Loaded sessions are checked against seeded replay, including question arrangements, stage history, counters, revision, RNG state, remaining pool, player ownership, mode, and catalog identity. Catalog identity includes IDs, labels, ISO codes, and ordering. Catalog changes therefore require an explicit migration. Reward records validate ownership, country uniqueness, and source fields separately. Validation is for data integrity; records are not signed or protected against deliberate local editing.

Malformed, oversized, unsupported-version, and inconsistent records throw `InvalidRecordError`. `code` distinguishes `invalid` from `unsupported-version`. No fallback erases or replaces rejected data. Version 1 has no migration from unknown schemas. Storage access and quota errors propagate to the caller; the UI must show failure and avoid claiming a durable success.

Adventure completion is saved before the reward write. If that write fails or execution stops between writes, `loadAdventure` reconciles rewards from completed stages. Reconciliation never grants a country twice. Reload Adventure after any interrupted transition. For an Explorer reward failure, retry the answer with the prior in-memory session; Explorer has no durable session to recover after process loss.

Use one writer per player/storage. Stale sequential Adventure snapshots are rejected before writing. This synchronous adapter cannot provide atomic transactions between browser tabs or devices. A future shared-storage adapter must serialize writes before Co-op, Battle, or concurrent play is integrated.

## Validation

Run from the isolated worktree:

```text
node node_modules/@playwright/test/cli.js test --config tests/game-session-core.config.ts
npm.cmd run typecheck
npm.cmd run build
git diff --check
```

The core test configuration needs no browser or server. Seeded cases check selection cycles, distractors, positions, resume at transition boundaries, mode separation, failed writes, corrupt records, reward idempotency, and preservation of existing storage. UI integration and physical-device acceptance are outside this module's scope.
