import { activities } from '../data/activities';
import { skills } from '../data/skills';
import type { AccountSave } from '../types';
import { getCombatLevel, getSkillLevel, getTotalLevel } from './skills';

export interface CodexOverviewStat {
  label: string;
  value: string;
  note?: string;
}

export interface CodexCategoryProgress {
  id: string;
  label: string;
  current: number;
  total: number;
}

export interface CodexRecordRow {
  id: string;
  label: string;
  unique: number;
  total: number;
}

export interface CodexSummary {
  overviewStats: CodexOverviewStat[];
  collectionCategories: CodexCategoryProgress[];
  recordRows: CodexRecordRow[];
  achievementCategories: CodexCategoryProgress[];
}

const questTotals = {
  completed: 0,
  total: 0,
  points: 0,
};

const achievementCategories: CodexCategoryProgress[] = [
  { id: 'exploration', label: 'Exploration', current: 0, total: 8 },
  { id: 'combat', label: 'Combat', current: 0, total: 8 },
  { id: 'skills', label: 'Skills', current: 0, total: 8 },
  { id: 'collection', label: 'Collection', current: 0, total: 8 },
  { id: 'account', label: 'Account', current: 0, total: 8 },
];

const collectionCategories: CodexCategoryProgress[] = [
  { id: 'collector_items', label: 'Collector Items', current: 0, total: 3800 },
  { id: 'mounts', label: 'Mounts', current: 0, total: 80 },
  { id: 'pets', label: 'Pets', current: 0, total: 60 },
  { id: 'skins', label: 'Skins', current: 0, total: 60 },
];

const formatRatio = (current: number, total: number) => `${current.toLocaleString()} / ${total.toLocaleString()}`;

const getProgressTotal = (categories: CodexCategoryProgress[]) => categories.reduce((sum, category) => sum + category.total, 0);

const getProgressCurrent = (categories: CodexCategoryProgress[]) => categories.reduce((sum, category) => sum + category.current, 0);

const getPercent = (current: number, total: number) => (total > 0 ? (current / total) * 100 : 0);

const getActivityCompletionRecord = (account: AccountSave): CodexRecordRow => {
  const uniqueCompletedActivities = new Set(account.activityLog.map((entry) => entry.activityName)).size;

  return {
    id: 'activity_completions',
    label: 'Activity Completions',
    unique: uniqueCompletedActivities || (account.completedActivities > 0 ? 1 : 0),
    total: account.completedActivities,
  };
};

const getExplorationDiscoveryRecord = (account: AccountSave): CodexRecordRow => {
  const uniqueDiscoveryTracks = Object.entries(account.regionProgress).reduce((sum, [activityId, progress]) => {
    const activity = activities.find((candidate) => candidate.id === activityId);
    if (!activity) {
      return sum;
    }

    return sum + activity.discoveryTracks.filter((track) => (progress.tracks[track.id] ?? 0) > 0).length;
  }, 0);

  const totalDiscoveries = Object.entries(account.regionProgress).reduce((sum, [activityId, progress]) => {
    const activity = activities.find((candidate) => candidate.id === activityId);
    if (!activity) {
      return sum;
    }

    return sum + activity.discoveryTracks.reduce((trackSum, track) => trackSum + (progress.tracks[track.id] ?? 0), 0);
  }, 0);

  return {
    id: 'exploration_discoveries',
    label: 'Exploration Discoveries',
    unique: uniqueDiscoveryTracks,
    total: totalDiscoveries,
  };
};

const getRegionRecord = (account: AccountSave): CodexRecordRow => {
  const regionsWithProgress = Object.entries(account.regionProgress).filter(([activityId, progress]) => {
    const activity = activities.find((candidate) => candidate.id === activityId);
    if (!activity) {
      return false;
    }

    return activity.discoveryTracks.some((track) => (progress.tracks[track.id] ?? 0) > 0);
  }).length;

  return {
    id: 'regions_explored',
    label: 'Regions Explored',
    unique: regionsWithProgress,
    total: regionsWithProgress,
  };
};

const getRecordRows = (account: AccountSave): CodexRecordRow[] => [
  getActivityCompletionRecord(account),
  getExplorationDiscoveryRecord(account),
  getRegionRecord(account),
  { id: 'boss_kills', label: 'Boss Kills', unique: 0, total: 0 },
  { id: 'dungeon_runs', label: 'Dungeon Runs', unique: 0, total: 0 },
];

export const getCodexSummary = (account: AccountSave): CodexSummary => {
  const totalSkillLevel = getTotalLevel(account);
  const skillsAt99 = skills.filter((skill) => getSkillLevel(account, skill.id) >= 99).length;
  const skillsAt120 = skills.filter((skill) => getSkillLevel(account, skill.id) >= 120).length;
  const collectionCurrent = getProgressCurrent(collectionCategories);
  const collectionTotal = getProgressTotal(collectionCategories);
  const completedAchievements = getProgressCurrent(achievementCategories);
  const totalAchievements = getProgressTotal(achievementCategories);
  const achievementPoints = 0;
  const recordRows = getRecordRows(account);
  const uniqueRecords = recordRows.reduce((sum, record) => sum + record.unique, 0);
  const totalRecords = recordRows.reduce((sum, record) => sum + record.total, 0);

  return {
    overviewStats: [
      { label: 'Combat Level', value: getCombatLevel(account).toFixed(2) },
      { label: 'Total Skill Level', value: totalSkillLevel.toLocaleString() },
      { label: 'Skills at 99', value: skillsAt99.toLocaleString() },
      { label: 'Skills at 120', value: skillsAt120.toLocaleString() },
      { label: 'Total Quests', value: formatRatio(questTotals.completed, questTotals.total) },
      { label: 'Quest Points', value: questTotals.points.toLocaleString() },
      { label: 'Achievements', value: formatRatio(completedAchievements, totalAchievements) },
      { label: 'Achievement Points', value: achievementPoints.toLocaleString() },
      { label: 'Unique Records', value: uniqueRecords.toLocaleString() },
      { label: 'Records', value: totalRecords.toLocaleString() },
      { label: 'Collection', value: formatRatio(collectionCurrent, collectionTotal) },
      { label: 'Collection %', value: `${getPercent(collectionCurrent, collectionTotal).toFixed(3)}%` },
    ],
    collectionCategories,
    recordRows,
    achievementCategories,
  };
};

export const getCollectionPercent = (category: CodexCategoryProgress) => getPercent(category.current, category.total);
