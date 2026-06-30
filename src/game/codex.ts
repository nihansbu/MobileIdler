import { activities } from '../data/activities';
import { skills } from '../data/skills';
import type { AccountSave } from '../types';
import { getCombatLevel, getSkillLevel, getTotalLevel } from './skills';

export interface CodexOverviewStat {
  label: string;
  value: string;
  current: number;
  total: number;
  percent: number;
  percentLabel: string;
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
  uniqueTotal: number;
  value: number;
  valueTotal: number;
  percent: number;
  percentLabel: string;
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
  pointTotal: 0,
};

const combatLevelTotal = 138;
const achievementPointsPerAchievement = 10;
const activityCompletionMilestonePerActivity = 10;

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

const getPercent = (current: number, total: number) => (total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0);

const getPercentLabel = (current: number, total: number) => `${getPercent(current, total).toFixed(3)}%`;

const createOverviewStat = (label: string, value: string, current: number, total: number): CodexOverviewStat => ({
  label,
  value,
  current,
  total,
  percent: getPercent(current, total),
  percentLabel: getPercentLabel(current, total),
});

const currentActivityNames = new Set(activities.map((activity) => activity.name));

const getCurrentActivityLogs = (account: AccountSave) => account.activityLog.filter((entry) => currentActivityNames.has(entry.activityName));

const getActivityCompletionRecord = (account: AccountSave): CodexRecordRow => {
  const validActivityLogs = getCurrentActivityLogs(account);
  const uniqueCompletedActivities = new Set(validActivityLogs.map((entry) => entry.activityName)).size;
  const valueTotal = activities.length * activityCompletionMilestonePerActivity;

  return {
    id: 'activity_completions',
    label: 'Activity Completions',
    unique: uniqueCompletedActivities,
    uniqueTotal: activities.length,
    value: validActivityLogs.length,
    valueTotal,
    percent: getPercent(validActivityLogs.length, valueTotal),
    percentLabel: getPercentLabel(validActivityLogs.length, valueTotal),
  };
};

const getExplorationDiscoveryRecord = (account: AccountSave): CodexRecordRow => {
  const currentExploreActivities = activities.filter((activity) => activity.module === 'explore');
  const uniqueTotal = currentExploreActivities.reduce((sum, activity) => sum + activity.discoveryTracks.length, 0);
  const valueTotal = currentExploreActivities.reduce((sum, activity) => sum + activity.discoveryTracks.reduce((trackSum, track) => trackSum + track.max, 0), 0);
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

    return sum + activity.discoveryTracks.reduce((trackSum, track) => trackSum + Math.min(track.max, progress.tracks[track.id] ?? 0), 0);
  }, 0);

  return {
    id: 'exploration_discoveries',
    label: 'Exploration Discoveries',
    unique: uniqueDiscoveryTracks,
    uniqueTotal,
    value: totalDiscoveries,
    valueTotal,
    percent: getPercent(totalDiscoveries, valueTotal),
    percentLabel: getPercentLabel(totalDiscoveries, valueTotal),
  };
};

const getRegionRecord = (account: AccountSave): CodexRecordRow => {
  const currentExploreActivities = activities.filter((activity) => activity.module === 'explore');
  const regionsWithProgress = Object.entries(account.regionProgress).filter(([activityId, progress]) => {
    const activity = activities.find((candidate) => candidate.id === activityId);
    if (!activity || activity.module !== 'explore') {
      return false;
    }

    return activity.discoveryTracks.some((track) => (progress.tracks[track.id] ?? 0) > 0);
  }).length;

  return {
    id: 'regions_explored',
    label: 'Regions Explored',
    unique: regionsWithProgress,
    uniqueTotal: currentExploreActivities.length,
    value: regionsWithProgress,
    valueTotal: currentExploreActivities.length,
    percent: getPercent(regionsWithProgress, currentExploreActivities.length),
    percentLabel: getPercentLabel(regionsWithProgress, currentExploreActivities.length),
  };
};

const getRecordRows = (account: AccountSave): CodexRecordRow[] => [
  getActivityCompletionRecord(account),
  getExplorationDiscoveryRecord(account),
  getRegionRecord(account),
  { id: 'boss_kills', label: 'Boss Kills', unique: 0, uniqueTotal: 0, value: 0, valueTotal: 0, percent: 0, percentLabel: '0.000%' },
  { id: 'dungeon_runs', label: 'Dungeon Runs', unique: 0, uniqueTotal: 0, value: 0, valueTotal: 0, percent: 0, percentLabel: '0.000%' },
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
  const achievementPointTotal = totalAchievements * achievementPointsPerAchievement;
  const recordRows = getRecordRows(account);
  const uniqueRecords = recordRows.reduce((sum, record) => sum + record.unique, 0);
  const uniqueRecordTotal = recordRows.reduce((sum, record) => sum + record.uniqueTotal, 0);
  const totalRecords = recordRows.reduce((sum, record) => sum + record.value, 0);
  const recordTotal = recordRows.reduce((sum, record) => sum + record.valueTotal, 0);
  const combatLevel = getCombatLevel(account);
  const totalSkillLevelCap = skills.length * 120;

  return {
    overviewStats: [
      createOverviewStat('Combat Level', combatLevel.toFixed(2), combatLevel, combatLevelTotal),
      createOverviewStat('Total Skill Level', totalSkillLevel.toLocaleString(), totalSkillLevel, totalSkillLevelCap),
      createOverviewStat('Skills at 99', skillsAt99.toLocaleString(), skillsAt99, skills.length),
      createOverviewStat('Skills at 120', skillsAt120.toLocaleString(), skillsAt120, skills.length),
      createOverviewStat('Total Quests', formatRatio(questTotals.completed, questTotals.total), questTotals.completed, questTotals.total),
      createOverviewStat('Quest Points', questTotals.points.toLocaleString(), questTotals.points, questTotals.pointTotal),
      createOverviewStat('Achievements', formatRatio(completedAchievements, totalAchievements), completedAchievements, totalAchievements),
      createOverviewStat('Achievement Points', achievementPoints.toLocaleString(), achievementPoints, achievementPointTotal),
      createOverviewStat('Unique Records', formatRatio(uniqueRecords, uniqueRecordTotal), uniqueRecords, uniqueRecordTotal),
      createOverviewStat('Records', formatRatio(totalRecords, recordTotal), totalRecords, recordTotal),
      createOverviewStat('Collection', formatRatio(collectionCurrent, collectionTotal), collectionCurrent, collectionTotal),
      createOverviewStat('Collection %', `${getPercent(collectionCurrent, collectionTotal).toFixed(3)}%`, collectionCurrent, collectionTotal),
    ],
    collectionCategories,
    recordRows,
    achievementCategories,
  };
};

export const getCodexPercent = (current: number, total: number) => getPercent(current, total);

export const getCodexPercentLabel = (current: number, total: number) => getPercentLabel(current, total);
