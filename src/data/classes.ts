import type { ClassDefinition } from '../types';

export const classes: ClassDefinition[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    summary: 'Reliable frontline fighter with stable early combat performance.',
    passives: [
      {
        id: 'weapon_focus',
        name: 'Weapon Focus',
        description: '+5% combat activity speed.',
      },
      {
        id: 'battle_hardened',
        name: 'Battle Hardened',
        description: '+5% failure resistance in combat activities.',
      },
    ],
  },
  {
    id: 'paladin',
    name: 'Paladin',
    summary: 'Defensive fighter with holy resilience. Restricted for some races at start.',
    passives: [
      {
        id: 'holy_guard',
        name: 'Holy Guard',
        description: '+5% protection against combat failure.',
      },
      {
        id: 'undead_bane',
        name: 'Undead Bane',
        description: '+5% effectiveness against undead enemies later.',
      },
    ],
  },
  {
    id: 'mage',
    name: 'Mage',
    summary: 'Fragile but efficient in knowledge, magic, and arcane activity chains.',
    passives: [
      {
        id: 'arcane_focus',
        name: 'Arcane Focus',
        description: '+5% magic-themed activity speed.',
      },
      {
        id: 'quick_study',
        name: 'Quick Study',
        description: '+5% training reward in future skill systems.',
      },
    ],
  },
];
