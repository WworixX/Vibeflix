type CacheEntry<T> = { value: T; expires: number };

export class TTLCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  constructor(private defaultTtlMs: number) {}

  get(key: string): T | null {
    const e = this.store.get(key);
    if (!e) return null;
    if (Date.now() > e.expires) {
      this.store.delete(key);
      return null;
    }
    return e.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    this.store.set(key, {
      value,
      expires: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  size(): number {
    return this.store.size;
  }
}
