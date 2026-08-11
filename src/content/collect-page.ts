import {bossJobAdapter} from '../adapters/boss-job-adapter';
import {createAdapterRegistry} from '../adapters/registry';
import type {PageContext} from '../adapters/types';
import {validateJobRecord} from '../domain/validate';
import type {ContentCollectionResult} from '../shared/messages';

const registry = createAdapterRegistry([bossJobAdapter]);

export function collectJobFromPage(
  context: PageContext,
  collectedAt: string,
  collectorVersion: string,
): ContentCollectionResult {
  const adapter = registry.find(context);
  if (!adapter) return {ok: false, code: 'UNSUPPORTED_PAGE'};

  const extraction = adapter.extract(context);
  if (!extraction.ok) return extraction;

  return validateJobRecord(extraction.draft, collectedAt, collectorVersion);
}
