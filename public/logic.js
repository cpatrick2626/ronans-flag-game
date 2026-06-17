// Color The Flag — online rules module (co-op + versus).
// Region ids and color indexes come from the shared country database.

import { COLOR_THE_FLAG_COUNTRIES } from "./countries.js";

export const meta = { game: "color-the-flag", minPlayers: 2, maxPlayers: 2 };

export const COUNTRY_PROGRESS_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETE: "complete",
  PERFECT: "perfect",
};

const FLAGS = Object.fromEntries(
  COLOR_THE_FLAG_COUNTRIES.map(flag => [
    flag.id,
    Object.fromEntries(flag.regions.map(region => [region.id, region.color])),
  ])
);
const FLAG_IDS = Object.keys(FLAGS);

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function currentFlag(state) {
  return state.order[state.round % state.order.length];
}

function freshBoards(state) {
  return state.mode === "coop"
    ? { shared: {} }
    : { [state.players[0]]: {}, [state.players[1]]: {} };
}

export function setup(players) {
  return {
    players: [...players],
    phase: "lobby",          // lobby -> playing -> done (round over)
    mode: null,               // "coop" | "versus"
    names: {},
    order: shuffle(FLAG_IDS),
    round: 0,
    boards: {},
    winner: null,
    wins: {},                 // versus round wins per player
    coopDone: 0,              // co-op flags completed together
  };
}

export function validateAction(state, playerId, action) {
  if (!action || typeof action.type !== "string") {
    return { ok: false, error: "Unknown action." };
  }
  switch (action.type) {
    case "set_name": {
      if (typeof action.name !== "string" || !action.name.trim()) {
        return { ok: false, error: "Please enter a name." };
      }
      return { ok: true };
    }
    case "set_mode": {
      if (state.phase !== "lobby") return { ok: false, error: "The game already started." };
      if (playerId !== state.players[0]) return { ok: false, error: "Only the room creator picks the mode." };
      if (action.mode !== "coop" && action.mode !== "versus") return { ok: false, error: "Pick Co-op or Head-to-Head." };
      return { ok: true };
    }
    case "color": {
      if (state.phase !== "playing") return { ok: false, error: "The round isn't running." };
      const flag = FLAGS[currentFlag(state)];
      if (!(action.region in flag)) return { ok: false, error: "That part isn't on this flag." };
      const board = state.mode === "coop" ? state.boards.shared : state.boards[playerId];
      if (!board) return { ok: false, error: "You don't have a board in this room." };
      if (action.region in board) return { ok: false, error: "That part is already colored!" };
      if (action.color !== flag[action.region]) return { ok: false, error: "Oops — that color goes somewhere else!" };
      return { ok: true };
    }
    case "next_flag": {
      if (state.phase !== "done") return { ok: false, error: "Finish this flag first!" };
      if (action.round !== state.round) return { ok: false, error: "Already moving on." };
      return { ok: true };
    }
    default:
      return { ok: false, error: "Unknown action." };
  }
}

export function applyAction(state, playerId, action) {
  switch (action.type) {
    case "set_name": {
      const names = { ...state.names, [playerId]: action.name.trim().slice(0, 16) };
      return { ...state, names };
    }
    case "set_mode": {
      const next = { ...state, mode: action.mode, phase: "playing" };
      return { ...next, boards: freshBoards(next) };
    }
    case "color": {
      const flag = FLAGS[currentFlag(state)];
      const total = Object.keys(flag).length;
      if (state.mode === "coop") {
        const shared = { ...state.boards.shared, [action.region]: action.color };
        const done = Object.keys(shared).length === total;
        return {
          ...state,
          boards: { shared },
          phase: done ? "done" : "playing",
          coopDone: done ? state.coopDone + 1 : state.coopDone,
        };
      }
      const mine = { ...state.boards[playerId], [action.region]: action.color };
      const boards = { ...state.boards, [playerId]: mine };
      const won = Object.keys(mine).length === total;
      if (!won) return { ...state, boards };
      return {
        ...state,
        boards,
        phase: "done",
        winner: playerId,
        wins: { ...state.wins, [playerId]: (state.wins[playerId] || 0) + 1 },
      };
    }
    case "next_flag": {
      const next = { ...state, round: state.round + 1, winner: null, phase: "playing" };
      return { ...next, boards: freshBoards(next) };
    }
    default:
      return state;
  }
}

// Rounds repeat forever inside one room; the engine-level game never "ends".
export function isGameOver() {
  return { over: false };
}

export function viewFor(state, playerId) {
  const flagId = currentFlag(state);
  const flag = FLAGS[flagId];
  const total = Object.keys(flag).length;
  const view = {
    phase: state.phase,
    mode: state.mode,
    names: state.names,
    players: state.players,
    flagId,
    round: state.round,
    winner: state.winner,
    wins: state.wins,
    coopDone: state.coopDone,
    progress: {},
    board: null,
  };
  if (state.mode === "coop") {
    view.board = state.boards.shared || {};
    const pct = Math.round((Object.keys(view.board).length / total) * 100);
    for (const p of state.players) view.progress[p] = pct;
  } else if (state.mode === "versus") {
    // Each player sees only their own board; opponents show as a progress %.
    view.board = state.boards[playerId] || {};
    for (const p of state.players) {
      const b = state.boards[p] || {};
      view.progress[p] = Math.round((Object.keys(b).length / total) * 100);
    }
  }
  return view;
}

export function getFlagById(flagId) {
  return FLAGS[flagId] || null;
}

export function getCountryCompletionState(countryCode, existing = {}) {
  return {
    countryCode,
    name: existing.name || "",
    continent: existing.continent || "",
    status: existing.status || COUNTRY_PROGRESS_STATUS.NOT_STARTED,
    stars: existing.stars || 0,
    completedAt: existing.completedAt || null,
    souvenirUnlocked: Boolean(existing.souvenirUnlocked),
    stampUnlocked: Boolean(existing.stampUnlocked),
    xpEarned: existing.xpEarned || 0,
  };
}

export function getPlayerProgressState(existing = {}) {
  return {
    playerName: existing.playerName || "Ronan",
    xp: existing.xp || 0,
    explorerLevel: existing.explorerLevel || 1,
    levelTitle: existing.levelTitle || "Junior Explorer",
    completedCountries: existing.completedCountries || 0,
    perfectFlags: existing.perfectFlags || 0,
    unlockedSouvenirs: Array.isArray(existing.unlockedSouvenirs) ? [...existing.unlockedSouvenirs] : [],
    passportStamps: Array.isArray(existing.passportStamps) ? [...existing.passportStamps] : [],
  };
}

export function getExplorerLevelTitle(level) {
  if (level >= 36) return "Globe Master";
  if (level >= 21) return "Passport Pro";
  if (level >= 11) return "World Traveler";
  if (level >= 6) return "Flag Finder";
  return "Junior Explorer";
}

export function getSouvenirForCountry(countryCode) {
  const souvenirs = {
    FR: ["france_eiffel_tower", "Eiffel Tower"],
    JP: ["japan_cherry_blossom", "Cherry Blossom"],
    BR: ["brazil_soccer_ball", "Soccer Ball"],
    US: ["usa_statue_of_liberty", "Statue of Liberty"],
    IT: ["italy_pizza", "Pizza"],
  };
  const generic = ["explorer_sticker", "Explorer Sticker"];
  return souvenirs[countryCode] || generic;
}

export function createCompletionReward(country, opts = {}) {
  const stars = opts.stars ?? 3;
  const completionDate = opts.completedAt || new Date().toISOString().slice(0, 10);
  const [souvenirId, souvenirName] = getSouvenirForCountry(country.iso2);
  const xpBase = 10;
  const xpPerfect = stars >= 3 ? 5 : 0;
  const xpSouvenir = 10;
  const xpEarned = xpBase + xpPerfect + xpSouvenir;
  return {
    countryCode: country.iso2,
    countryName: country.name,
    countryId: country.id,
    flagEmoji: country.flag_emoji || country.flagEmoji || null,
    stars,
    message: `You colored ${country.name}!`,
    passportStamp: {
      label: `${country.name.toUpperCase()} COMPLETE`,
      countryName: country.name,
      countryCode: country.iso2,
      flagEmoji: country.flag_emoji || country.flagEmoji || null,
      completedAt: completionDate,
      stars,
    },
    souvenir: {
      id: souvenirId,
      name: souvenirName,
    },
    xp: {
      flagComplete: xpBase,
      perfectBonus: xpPerfect,
      souvenirBonus: xpSouvenir,
      total: xpEarned,
    },
    celebration: {
      confetti: true,
      sparkles: true,
      bounce: true,
      message: `You colored ${country.name}!`,
    },
  };
}

export function applyCountryCompletion({
  playerProgress,
  country,
  stars = 3,
  completedAt,
}) {
  const nextPlayer = getPlayerProgressState(playerProgress);
  const [souvenirId] = getSouvenirForCountry(country.iso2);
  const reward = createCompletionReward(country, { stars, completedAt });
  const gainedXp = reward.xp.total;
  const nextLevel = Math.max(1, Math.floor((nextPlayer.xp + gainedXp) / 25) + 1);
  const unlockedSouvenirs = nextPlayer.unlockedSouvenirs.includes(souvenirId)
    ? nextPlayer.unlockedSouvenirs
    : [...nextPlayer.unlockedSouvenirs, souvenirId];
  const passportStamps = [
    ...nextPlayer.passportStamps,
    reward.passportStamp,
  ];

  const updatedPlayer = {
    ...nextPlayer,
    xp: nextPlayer.xp + gainedXp,
    explorerLevel: nextLevel,
    levelTitle: getExplorerLevelTitle(nextLevel),
    completedCountries: nextPlayer.completedCountries + 1,
    perfectFlags: nextPlayer.perfectFlags + (stars >= 3 ? 1 : 0),
    unlockedSouvenirs,
    passportStamps,
  };

  return {
    playerProgress: updatedPlayer,
    countryProgress: getCountryCompletionState(country.iso2, {
      countryCode: country.iso2,
      name: country.name,
      continent: country.continent,
      status: stars >= 3 ? COUNTRY_PROGRESS_STATUS.PERFECT : COUNTRY_PROGRESS_STATUS.COMPLETE,
      stars,
      completedAt: reward.passportStamp.completedAt,
      souvenirUnlocked: true,
      stampUnlocked: true,
      xpEarned: gainedXp,
    }),
    reward,
  };
}
