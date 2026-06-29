import type { ActivityDefinition } from '../types';

export const activities: ActivityDefinition[] = [
  {
    id: 'explore_first_region',
    name: 'Explore First Region',
    category: 'explore',
    durationMinutes: 15,
    rapCost: 5,
    description: 'Scout the starting region and build early exploration progress.',
    rewardLabel: '+20 XP, +1 region progress',
  },
  {
    id: 'train_endurance',
    name: 'Train Endurance',
    category: 'train',
    durationMinutes: 30,
    rapCost: 10,
    description: 'Spend time on basic conditioning. This is the first skill placeholder.',
    rewardLabel: '+35 XP, endurance tracked later',
  },
  {
    id: 'fight_training_dummy',
    name: 'Fight Training Dummy',
    category: 'combat',
    durationMinutes: 10,
    rapCost: 3,
    description: 'Safe starter combat. No death chance in the MVP.',
    rewardLabel: '+12 XP, combat check logged',
  },
];
