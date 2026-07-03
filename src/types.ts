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

export type ActivityId = 'explore_old_road' | 'minigame_herbalists_crucible' | 'minigame_tidepool_trials' | 'minigame_familiar_grove';

export type ViewId = 'account' | 'activities' | 'skills' | 'codex';

export type CharacterStatus = 'idle' | 'busy';
export type ActivityModule = 'explore' | 'minigame';
export type CollectionCategory = 'collectorItems' | 'mounts' | 'pets' | 'skins';

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

export type CompletionRewardDefinition =
  | RewardDefinition
  | {
      type: 'passiveSkillXp';
      skillId: SkillId;
      multiplier: number;
    };

export interface CollectionEntryDefinition {
  id: string;
  category: CollectionCategory;
  name: string;
  description: string;
  source: string;
}

export interface CollectionEntrySave {
  owned: boolean;
  copies: number;
  firstObtainedAt?: number;
  firstSource?: string;
}

export type CollectionSave = Record<CollectionCategory, Record<string, CollectionEntrySave>>;

export interface DropDefinition {
  id: string;
  label: string;
  collectionCategory: CollectionCategory;
  collectionId: string;
  chanceNumerator: number;
  chanceDenominator: number;
}

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
  regionName?: string;
  durationMinutes: number;
  rapCost: number;
  tickIntervalSeconds: number;
  description: string;
  requirements: RequirementDefinition[];
  repeatRewards: RewardDefinition[];
  completionRewards: CompletionRewardDefinition[];
  dropTable: DropDefinition[];
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
  schemaVersion: 4;
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
  collections: CollectionSave;
  activityLog: ActivityLogEntry[];
  updatedAt: number;
}
