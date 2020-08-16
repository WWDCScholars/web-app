export function arrayWithoutIndex<T>(array: T[], indexToRemove: number): T[] {
  return [...array.slice(0, indexToRemove), ...array.slice(indexToRemove + 1, array.length)]
}
