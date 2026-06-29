export type RaceId = 'human' | 'orc' | 'undead';
export type ClassId = 'warrior' | 'paladin' | 'mage';
export type ActivityId = 'explore_first_region' | 'train_endurance' | 'fight_training_dummy';

export type ViewId = 'account' | 'characters' | 'activities' | 'progress';

export type CharacterStatus = 'idle' | 'busy';

export interface PassiveDefinition {
  id: string;
  name: string;
  description: string;
}

export interface RaceDefinition {
  id: RaceId;
  name: string;
  summary: string;
  passive: PassiveDefinition;
  allowedClasses: ClassId[];
}

export interface ClassDefinition {
  id: ClassId;
  name: string;
  summary: string;
  passives: PassiveDefinition[];
}

export interface ActivityDefinition {
  id: ActivityId;
  name: string;
  category: 'explore' | 'train' | 'combat';
  durationMinutes: number;
  rapCost: number;
  description: string;
  rewardLabel: string;
}

export interface ActiveActivity {
  activityId: ActivityId;
  startedAt: number;
  endsAt: number;
  rapCost: number;
}

export interface CharacterSave {
  id: string;
  name: string;
  raceId: RaceId;
  classId: ClassId;
  level: number;
  xp: number;
  activity: ActiveActivity | null;
}

export interface ActivityLogEntry {
  id: string;
  at: number;
  characterName: string;
  activityName: string;
  result: string;
}

export interface AccountSave {
  schemaVersion: 1;
  accountName: string;
  rap: number;
  characterSlots: number;
  characters: CharacterSave[];
  completedActivities: number;
  unlockedRaceClassCombos: string[];
  activityLog: ActivityLogEntry[];
  updatedAt: number;
}
