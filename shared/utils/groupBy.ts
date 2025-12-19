type GroupBy<T, K extends keyof T> = Record<string & T[K], T[]>;

export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K,
): GroupBy<T, K> {
  return array.reduce((acc, item) => {
    const keyValue = item[key] as unknown as string & T[K];
    if (!acc[keyValue]) {
      acc[keyValue] = [];
    }
    acc[keyValue].push(item);
    return acc;
  }, {} as GroupBy<T, K>);
}

function getValueByPath<T>(obj: T, path: string): any {
  return path.split('.').reduce<any>((o, key) => (o ? o[key] : undefined), obj);
}

export function groupByPath<T>(
  array: T[],
  path: string,
): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const keyValue = getValueByPath(item, path);

    const key = String(keyValue ?? 'undefined');

    if (!acc[key])
      acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {} as Record<string, T[]>);
}
