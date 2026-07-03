import type { CollectionEntryDefinition } from '../types';

export const collectionEntries: CollectionEntryDefinition[] = [
  {
    id: 'brinebound_turtle',
    category: 'mounts',
    name: 'Brinebound Turtle',
    description: 'A patient tidepool mount with a shell polished by salt and moonlight.',
    source: 'Tidepool Trials',
  },
  {
    id: 'tidepool_otter',
    category: 'pets',
    name: 'Tidepool Otter',
    description: 'A rare companion that follows the sound of splashing buckets and lucky casts.',
    source: 'Tidepool Trials',
  },
];

export const collectionCategoryLabels = {
  collectorItems: 'Collector Items',
  mounts: 'Mounts',
  pets: 'Pets',
  skins: 'Skins',
} as const;
