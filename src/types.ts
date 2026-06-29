export type RaceId = 'human' | 'orc' | 'undead';
export type ClassId = 'warrior' | 'paladin' | 'mage';
export type SkillId =
  | 'attack'
  | 'strength'
  | 'defence'
  | 'constitution'
  | 'ranged'
  | 'magic'
  | 'prayer'
  | 'summoning'
  | 'necromancy'
  | 'mining'
  | 'smithing'
  | 'fishing'
  | 'cooking'
  | 'firemaking'
  | 'woodcutting'
  | 'crafting'
  | 'fletching'
  | 'runecrafting'
  | 'construction'
  | 'agility'
  | 'herblore'
  | 'thieving'
  | 'slayer'
  | 'farming'
  | 'hunter'
  | 'divination'
  | 'dungeoneering'
  | 'invention'
  | 'archaeology'
  | 'sailing';

export type ActivityId = 'explore_old_road';

export type ViewId = 'account' | 'activities' | 'skills' | 'progress';

export type CharacterStatus = 'idle' | 'busy';
export type ActivityModule = 'explore';

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

export interface SkillDefinition {
  id: SkillId;
  name: string;
  description: string;
  unlockTotalLevel?: number;
}

export type RequirementDefinition =
  | {
      type: 'skillLevel';
      skillId: SkillId;
      level: number;
    }
  | {
      type: 'combatLevel';
      level: number;
    };

export type RewardDefinition = {
  type: 'skillXp';
  skillId: SkillId;
  amount: number;
};

export interface DiscoveryTrackDefinition {
  id: string;
  label: string;
  max: number;
  chancePerTick: number;
}

export interface ActivityDefinition {
  id: ActivityId;
  module: ActivityModule;
  name: string;
  regionName: string;
  durationMinutes: number;
  rapCost: number;
  tickIntervalSeconds: number;
  description: string;
  requirements: RequirementDefinition[];
  repeatRewards: RewardDefinition[];
  discoveryTracks: DiscoveryTrackDefinition[];
  completionRewardLabel: string;
}

export interface ActiveActivity {
  activityId: ActivityId;
  startedAt: number;
  endsAt: number;
  rapCost: number;
  resolvedTicks: number;
}

export interface CharacterSave {
  id: string;
  name: string;
  raceId: RaceId;
  classId: ClassId;
  activity: ActiveActivity | null;
}

export interface RegionProgressSave {
  tracks: Record<string, number>;
  completed: boolean;
}

export interface ActivityLogEntry {
  id: string;
  at: number;
  characterName: string;
  activityName: string;
  result: string;
}

export interface AccountSave {
  schemaVersion: 3;
  accountName: string;
  rap: number;
  characterSlots: number;
  characters: CharacterSave[];
  activeCharacterId: string | null;
  rosterSlots: Array<string | null>;
  completedActivities: number;
  unlockedRaceClassCombos: string[];
  skillXp: Record<SkillId, number>;
  unlockedSkillIds: SkillId[];
  regionProgress: Record<string, RegionProgressSave>;
  activityLog: ActivityLogEntry[];
  updatedAt: number;
}
