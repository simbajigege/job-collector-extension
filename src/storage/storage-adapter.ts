export interface StorageAdapter {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export function createChromeStorageAdapter(): StorageAdapter {
  return {
    async get<T>(key: string): Promise<T | undefined> {
      const result = await chrome.storage.local.get(key);
      return result[key] as T | undefined;
    },
    async set<T>(key: string, value: T): Promise<void> {
      await chrome.storage.local.set({[key]: value});
    },
    async remove(key: string): Promise<void> {
      await chrome.storage.local.remove(key);
    },
  };
}

export function createMemoryStorageAdapter(): StorageAdapter {
  const values = new Map<string, unknown>();

  return {
    async get<T>(key: string): Promise<T | undefined> {
      const value = values.get(key);
      return value === undefined ? undefined : structuredClone(value as T);
    },
    async set<T>(key: string, value: T): Promise<void> {
      values.set(key, structuredClone(value));
    },
    async remove(key: string): Promise<void> {
      values.delete(key);
    },
  };
}
