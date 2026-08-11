import {afterEach, describe, expect, it, vi} from 'vitest';

import {createChromeStorageAdapter} from '../../src/storage/storage-adapter';

describe('Chrome storage adapter', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('delegates namespaced reads, writes and removals to chrome.storage.local', async () => {
    const get = vi.fn(async () => ({jobs: {one: 'record'}}));
    const set = vi.fn(async () => undefined);
    const remove = vi.fn(async () => undefined);
    vi.stubGlobal('chrome', {storage: {local: {get, set, remove}}});
    const adapter = createChromeStorageAdapter();

    await expect(adapter.get('jobs')).resolves.toEqual({one: 'record'});
    await adapter.set('jobs', {two: 'record'});
    await adapter.remove('jobs');

    expect(get).toHaveBeenCalledWith('jobs');
    expect(set).toHaveBeenCalledWith({jobs: {two: 'record'}});
    expect(remove).toHaveBeenCalledWith('jobs');
  });

  it('returns undefined for an absent key', async () => {
    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn(async () => ({})),
          set: vi.fn(),
          remove: vi.fn(),
        },
      },
    });

    await expect(createChromeStorageAdapter().get('missing')).resolves.toBeUndefined();
  });
});
