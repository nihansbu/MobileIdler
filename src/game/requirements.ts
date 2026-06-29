import { getRequirementCombatLevel, getSkillLevel, getSkill } from './skills';
import type { AccountSave, RequirementDefinition } from '../types';

export const isRequirementMet = (account: AccountSave, requirement: RequirementDefinition) => {
  if (requirement.type === 'skillLevel') {
    return getSkillLevel(account, requirement.skillId) >= requirement.level;
  }

  return getRequirementCombatLevel(account) >= requirement.level;
};

export const areRequirementsMet = (account: AccountSave, requirements: RequirementDefinition[]) =>
  requirements.every((requirement) => isRequirementMet(account, requirement));

export const getRequirementLabel = (requirement: RequirementDefinition) => {
  if (requirement.type === 'skillLevel') {
    return `${getSkill(requirement.skillId).name} ${requirement.level}`;
  }

  return `Combat Level ${requirement.level}`;
};

export const getRequirementsLabel = (requirements: RequirementDefinition[]) =>
  requirements.length === 0 ? 'No requirements' : requirements.map(getRequirementLabel).join(', ');
