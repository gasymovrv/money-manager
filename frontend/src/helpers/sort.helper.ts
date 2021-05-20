export function sortStrings(s1: string, s2: string): number {
  if (s1 > s2) {
    return 1;
  } else if (s1 === s2) {
    return 0;
  } else {
    return -1;
  }
}

type Category = {
  name: string
}

export function sortCategories(c1: Category, c2: Category): number {
  return sortStrings(c1.name, c2.name);
}