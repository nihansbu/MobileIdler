import { getCollectionEntry } from './content';
import type { AccountSave, DropDefinition } from '../types';

export interface DropResult {
  drop: DropDefinition;
  collectionName: string;
  isNew: boolean;
  copies: number;
}

const didRollDrop = (drop: DropDefinition) => {
  if (drop.chanceDenominator <= 1 || drop.chanceNumerator >= drop.chanceDenominator) {
    return true;
  }

  return Math.random() < drop.chanceNumerator / drop.chanceDenominator;
};

export const formatDropChance = (drop: DropDefinition) =>
  drop.chanceNumerator === 1 ? `1 / ${drop.chanceDenominator.toLocaleString()}` : `${drop.chanceNumerator} / ${drop.chanceDenominator.toLocaleString()}`;

export const rollDropTable = (account: AccountSave, dropTable: DropDefinition[], now: number, source: string): { account: AccountSave; drops: DropResult[] } => {
  let nextAccount = account;
  const drops: DropResult[] = [];

  for (const drop of dropTable) {
    if (!didRollDrop(drop)) {
      continue;
    }

    const collectionEntry = getCollectionEntry(drop.collectionCategory, drop.collectionId);
    const currentEntry = nextAccount.collections[drop.collectionCategory]?.[drop.collectionId] ?? { owned: false, copies: 0 };
    const isNew = !currentEntry.owned;
    const nextEntry = {
      owned: true,
      copies: isNew ? currentEntry.copies : currentEntry.copies + 1,
      firstObtainedAt: currentEntry.firstObtainedAt ?? now,
      firstSource: currentEntry.firstSource ?? source,
    };

    nextAccount = {
      ...nextAccount,
      collections: {
        ...nextAccount.collections,
        [drop.collectionCategory]: {
          ...nextAccount.collections[drop.collectionCategory],
          [drop.collectionId]: nextEntry,
        },
      },
    };

    drops.push({
      drop,
      collectionName: collectionEntry.name,
      isNew,
      copies: nextEntry.copies,
    });
  }

  return { account: nextAccount, drops };
};
