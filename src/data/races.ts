import type { RaceDefinition } from '../types';

export const races: RaceDefinition[] = [
  {
    id: 'human',
    name: 'Human',
    summary: 'Versatile and ambitious. Humans adapt quickly and can enter every starter class.',
    passive: {
      id: 'human_adaptability',
      name: 'Adaptability',
      description: '+5% flexible growth in future progression systems.',
    },
    allowedClasses: ['warrior', 'paladin', 'mage'],
  },
  {
    id: 'orc',
    name: 'Orc',
    summary: 'Direct and physical. Orcs are built for endurance and hard activity chains.',
    passive: {
      id: 'orc_resilience',
      name: 'Resilience',
      description: '+5% survival in physical combat checks.',
    },
    allowedClasses: ['warrior', 'mage'],
  },
  {
    id: 'undead',
    name: 'Undead',
    summary: 'Persistent and hard to break. Undead excel in hostile or cursed content.',
    passive: {
      id: 'undead_persistence',
      name: 'Persistence',
      description: '+5% resistance to failure penalties.',
    },
    allowedClasses: ['warrior', 'mage'],
  },
];
