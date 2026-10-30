export interface RandomState { value: number }

export function isSeed(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 0xffffffff;
}

// Mulberry32: the uint32 state is persisted so continuation consumes the same stream.
export function random(state: RandomState): number {
  state.value = (state.value + 0x6d2b79f5) >>> 0;
  let value = state.value;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
}

export function shuffled<T>(items: readonly T[], state: RandomState): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random(state) * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
