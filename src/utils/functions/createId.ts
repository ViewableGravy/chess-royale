export function createId<T extends (s: string) => any>(factory: T): ReturnType<T> {
  const id = String(Date.now()) + "_" + Math.random().toString(36).slice(2);
  return factory(id);
}
