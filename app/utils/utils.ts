export const deduplicateByProperty = <T>(
  arr: T[] | undefined,
  property: keyof T,
): T[] => {
  if (!arr) {
    return [];
  }

  const uniqueValues: Set<any> = new Set();

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
