export function objectMap<T, U>(
  object: { [key: string]: T },
  callbackfn: (value: T, key: string, index: number) => U,
  filterUndefined: boolean = false
): { [k: string]: U } {
  return Object.fromEntries(
    Object.entries(object)
      // include when filterUndefiend === false or entry !== undefined
      .filter(entry => !filterUndefined || !!entry[1])
      .map(
        ([key, value], index) => [key, callbackfn(value, key, index)]
      )
  )
}
