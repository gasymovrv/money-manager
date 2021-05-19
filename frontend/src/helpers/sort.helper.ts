export function stringSort(s1: string, s2: string): number {
  if (s1 > s2) {
    return 1;
  } else if (s1 === s2) {
    return 0;
  } else {
    return -1;
  }
}

type Type = {
  name: string
}

export function typesSort(t1: Type, t2: Type): number {
  return stringSort(t1.name, t2.name);
}