import { collectionEntries, collectionCategoryLabels } from '../data/collections';
import type { AccountSave, CollectionCategory, CollectionEntryDefinition, CollectionEntrySave, CollectionSave } from '../types';

export const collectionCategories: CollectionCategory[] = ['collectorItems', 'mounts', 'pets', 'skins'];

export const createInitialCollections = (): CollectionSave => ({
  collectorItems: {},
  mounts: {},
  pets: {},
  skins: {},
});

export const normalizeCollections = (collections: Partial<Record<CollectionCategory, Record<string, Partial<CollectionEntrySave>>>> | null | undefined): CollectionSave => {
  const normalized = createInitialCollections();

  for (const category of collectionCategories) {
    const entries = collections?.[category] ?? {};
    normalized[category] = Object.fromEntries(
      Object.entries(entries).map(([id, entry]) => [
        id,
        {
          owned: Boolean(entry?.owned),
          copies: Math.max(0, Math.floor(Number(entry?.copies ?? 0))),
          firstObtainedAt: typeof entry?.firstObtainedAt === 'number' ? entry.firstObtainedAt : undefined,
          firstSource: typeof entry?.firstSource === 'string' ? entry.firstSource : undefined,
        },
      ]),
    );
  }

  return normalized;
};

export const getCollectionEntrySave = (account: AccountSave, entry: CollectionEntryDefinition): CollectionEntrySave => ({
  owned: account.collections[entry.category]?.[entry.id]?.owned ?? false,
  copies: account.collections[entry.category]?.[entry.id]?.copies ?? 0,
  firstObtainedAt: account.collections[entry.category]?.[entry.id]?.firstObtainedAt,
  firstSource: account.collections[entry.category]?.[entry.id]?.firstSource,
});

export const getCollectionCategoryProgress = (account: AccountSave) =>
  collectionCategories.map((category) => {
    const entries = collectionEntries.filter((entry) => entry.category === category);
    const current = entries.filter((entry) => getCollectionEntrySave(account, entry).owned).length;

    return {
      id: category,
      label: collectionCategoryLabels[category],
      current,
      total: entries.length,
    };
  });

export const getCollectionEntryProgress = (account: AccountSave) =>
  collectionEntries.map((entry) => ({
    ...entry,
    save: getCollectionEntrySave(account, entry),
  }));
