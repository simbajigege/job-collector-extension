import type {JobSourceAdapter, PageContext} from './types';

export interface AdapterRegistry {
  find(context: PageContext): JobSourceAdapter | undefined;
}

export function createAdapterRegistry(
  adapters: readonly JobSourceAdapter[],
): AdapterRegistry {
  return {
    find(context) {
      return adapters.find((adapter) => adapter.canHandle(context));
    },
  };
}
