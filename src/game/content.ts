import { activities } from '../data/activities';
import { classes } from '../data/classes';
import { races } from '../data/races';
import type { ActivityId, ClassId, RaceId } from '../types';

export const getRace = (id: RaceId) => races.find((race) => race.id === id)!;
export const getClass = (id: ClassId) => classes.find((klass) => klass.id === id)!;
export const getActivity = (id: ActivityId) => activities.find((activity) => activity.id === id)!;

export const raceAllowsClass = (raceId: RaceId, classId: ClassId, unlockedCombos: string[]) => {
  const comboId = `${raceId}:${classId}`;
  return getRace(raceId).allowedClasses.includes(classId) || unlockedCombos.includes(comboId);
};
