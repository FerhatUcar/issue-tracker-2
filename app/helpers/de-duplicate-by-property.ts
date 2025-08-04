/**
 * Utility functions for various operations.
 * @param arr Array of items to deduplicate.
 * @param property The property to check for uniqueness.
 */
export const deduplicateByProperty = <T>(
  arr: T[] | undefined,
  property: keyof T,
): T[] => {
  if (!arr) {
    return [];
  }

  const uniqueValues: Set<T[keyof T]> = new Set();

  return arr.filter((item) => {
    if (item[property] === null) {
      return false;
    }

    if (uniqueValues.has(item[property])) {
      return false;
    } else {
      uniqueValues.add(item[property]);
      return true;
    }
  });
};
