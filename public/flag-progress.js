import { applyCountryCompletion, getPlayerProgressState, getCountryCompletionState, COUNTRY_PROGRESS_STATUS } from "./logic.js";
import { COUNTRY_BY_ID, COUNTRY_BY_ISO2 } from "./countries.js";

const STORAGE_KEY = "flag_progression_v1";
const LEGACY_STORAGE_KEYS = ["banana_progression_v1"];

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readStoredProgress(storage) {
  for (const key of [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]) {
    const parsed = safeParse(storage.getItem(key), null);
    if (parsed) return { parsed, sourceKey: key };
  }
  return { parsed: null, sourceKey: null };
}

function migrateStoredProgress(storage, parsed, sourceKey) {
  if (!storage || !parsed || sourceKey === STORAGE_KEY) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(parsed));
}

export function createDefaultFlagProgress(playerName = "Ronan") {
  return {
    playerName,
    xp: 0,
    explorerLevel: 1,
    levelTitle: "Junior Explorer",
    completedCountries: 0,
    perfectFlags: 0,
    unlockedSouvenirs: [],
    passportStamps: [],
    countries: {},
  };
}

export function loadFlagProgress(storage = globalThis.localStorage) {
  if (!storage) return createDefaultFlagProgress();
  const { parsed, sourceKey } = readStoredProgress(storage);
  if (!parsed) return createDefaultFlagProgress();
  const merged = {
    ...createDefaultFlagProgress(parsed.playerName || "Ronan"),
    ...getPlayerProgressState(parsed),
    countries: parsed.countries || {},
  };
  migrateStoredProgress(storage, merged, sourceKey);
  return merged;
}

export function saveFlagProgress(progress, storage = globalThis.localStorage) {
  if (!storage) return progress;
  storage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function completeCountry(countryCode, progress, opts = {}, storage = globalThis.localStorage) {
  const country = COUNTRY_BY_ISO2[countryCode] || COUNTRY_BY_ID[countryCode.toLowerCase()];
  if (!country) throw new Error(`Unknown country: ${countryCode}`);
  const existingCountry = progress.countries?.[country.iso2] || getCountryCompletionState(country.iso2);
  const next = applyCountryCompletion({
    playerProgress: progress,
    country,
    stars: opts.stars ?? 3,
    completedAt: opts.completedAt,
  });
  const countries = {
    ...(progress.countries || {}),
    [country.iso2]: {
      ...existingCountry,
      ...next.countryProgress,
      name: country.name,
      continent: country.continent,
    },
  };
  const finalState = { ...next.playerProgress, countries };
  saveFlagProgress(finalState, storage);
  return { ...next, progress: finalState };
}

export function getCountryProgress(progress, countryCode) {
  return progress.countries?.[countryCode] || getCountryCompletionState(countryCode);
}

export { COUNTRY_PROGRESS_STATUS };
