export function exclude<T, K extends keyof T>(
  object: T,
  ...keys: K[]
): Omit<T, K> {
  const result = JSON.parse(JSON.stringify(object));

  for (const k of keys) {
    delete result[k];
  }

  return result;
}
