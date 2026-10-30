import { COUNTRIES } from '../../public/countries.js';

export interface CatalogCountry {
  readonly id: string;
  readonly name: string;
  readonly iso2: string;
  readonly iso3: string;
}

// Reuse the existing worldwide catalog without changing flag gameplay or assets.
export const WORLD_COUNTRIES: readonly CatalogCountry[] = Object.freeze(
  COUNTRIES.map(({ id, name, iso2, iso3 }) => Object.freeze({ id, name, iso2, iso3 })),
);

export function validateCatalog(catalog: readonly CatalogCountry[]): void {
  if (catalog.length < 4) throw new Error('At least four catalog countries are required');
  for (const field of ['id', 'iso2', 'iso3'] as const) {
    if (new Set(catalog.map(country => country[field])).size !== catalog.length) {
      throw new Error(`Duplicate catalog ${field}`);
    }
  }
  if (catalog.some(country => !country.id || !country.name || !country.iso2 || !country.iso3)) {
    throw new Error('Incomplete catalog country');
  }
}

export function catalogIdentity(catalog: readonly CatalogCountry[]): string {
  return JSON.stringify(catalog.map(({ id, name, iso2, iso3 }) => [id, name, iso2, iso3]));
}
