import { applyCountryCompletion, getPlayerProgressState, getCountryCompletionState, COUNTRY_PROGRESS_STATUS } from "./logic.js";
import { COUNTRY_BY_ID, COUNTRY_BY_ISO2 } from "./countries.js";

const STORAGE_KEY = "banana_progression_v1";

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function createDefaultBananaProgress(playerName = "Ronan") {
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

export function loadBananaProgress(storage = globalThis.localStorage) {
  if (!storage) return createDefaultBananaProgress();
  const parsed = safeParse(storage.getItem(STORAGE_KEY), null);
  if (!parsed) return createDefaultBananaProgress();
  return {
    ...createDefaultBananaProgress(parsed.playerName || "Ronan"),
    ...getPlayerProgressState(parsed),
    countries: parsed.countries || {},
  };
}

export function saveBananaProgress(progress, storage = globalThis.localStorage) {
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
  saveBananaProgress(finalState, storage);
  return { ...next, progress: finalState };
}

export function getCountryProgress(progress, countryCode) {
  return progress.countries?.[countryCode] || getCountryCompletionState(countryCode);
}

export { COUNTRY_PROGRESS_STATUS };
