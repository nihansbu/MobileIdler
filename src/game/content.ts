import { activities } from '../data/activities';
import { classes } from '../data/classes';
import { collectionEntries } from '../data/collections';
import { races } from '../data/races';
import type { ActivityId, ClassId, CollectionCategory, RaceId } from '../types';

export const getRace = (id: RaceId) => races.find((race) => race.id === id)!;
export const getClass = (id: ClassId) => classes.find((klass) => klass.id === id)!;
export const getActivity = (id: ActivityId) => activities.find((activity) => activity.id === id)!;
export const getCollectionEntry = (category: CollectionCategory, id: string) =>
  collectionEntries.find((entry) => entry.category === category && entry.id === id)!;

export const raceAllowsClass = (raceId: RaceId, classId: ClassId, unlockedCombos: string[]) => {
  const comboId = `${raceId}:${classId}`;
  return getRace(raceId).allowedClasses.includes(classId) || unlockedCombos.includes(comboId);
};
