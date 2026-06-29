import type { ActivityDefinition } from '../types';

export const activities: ActivityDefinition[] = [
  {
    id: 'explore_old_road',
    module: 'explore',
    name: 'Explore Old Road',
    regionName: 'Old Road',
    durationMinutes: 5,
    rapCost: 400,
    tickIntervalSeconds: 10,
    description: 'Send a character along the broken trade road to uncover early regional progress.',
    requirements: [],
    repeatRewards: [
      { type: 'skillXp', skillId: 'perception', amount: 5 },
      { type: 'skillXp', skillId: 'agility', amount: 3 },
      { type: 'skillXp', skillId: 'constitution', amount: 2 },
    ],
    discoveryTracks: [
      { id: 'region_quests', label: 'Region Quests', max: 8, chancePerTick: 0.16 },
      { id: 'treasures', label: 'Treasures', max: 3, chancePerTick: 0.06 },
      { id: 'points_of_interest', label: 'Points of Interest', max: 5, chancePerTick: 0.1 },
      { id: 'world_bosses', label: 'World Bosses', max: 1, chancePerTick: 0.015 },
      { id: 'secrets', label: 'Secrets', max: 2, chancePerTick: 0.03 },
    ],
    completionRewardLabel: 'Old Road exploration resolved',
  },
];
