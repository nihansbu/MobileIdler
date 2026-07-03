import { activities } from '../data/activities';
import { skills } from '../data/skills';
import type { AccountSave } from '../types';
import { getCombatLevel, getSkillLevel, getTotalLevel } from './skills';

export interface CodexOverviewStat {
  label: string;
  value: string;
  current: number;
  total: number | null;
  percent: number | null;
  percentLabel: string | null;
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
  valueTotal: number | null;
  percent: number | null;
  percentLabel: string | null;
}

export interface CodexSummary {
  overviewStats: CodexOverviewStat[];
  collectionCategories: CodexCategoryProgress[];
  recordRows: CodexRecordRow[];
  achievementCategories: CodexCategoryProgress[];
}

const questTotals = {
  completed: 0,
  points: 0,
};

const combatLevelTotal = 138;

const achievementCategories: CodexCategoryProgress[] = [];
const collectionCategories: CodexCategoryProgress[] = [];

const formatRatio = (current: number, total: number) => `${current.toLocaleString()} / ${total.toLocaleString()}`;

const getProgressTotal = (categories: CodexCategoryProgress[]) => categories.reduce((sum, category) => sum + category.total, 0);

const getProgressCurrent = (categories: CodexCategoryProgress[]) => categories.reduce((sum, category) => sum + category.current, 0);

const getPercent = (current: number, total: number | null) =>
  total && total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : null;

const getPercentLabel = (current: number, total: number | null) => {
  const percent = getPercent(current, total);
  return percent === null ? null : `${percent.toFixed(3)}%`;
};

const createOverviewStat = (label: string, value: string, current: number, total: number | null): CodexOverviewStat => ({
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

  return {
    id: 'activity_completions',
    label: 'Activity Completions',
    unique: uniqueCompletedActivities,
    uniqueTotal: activities.length,
    value: validActivityLogs.length,
    valueTotal: null,
    percent: null,
    percentLabel: null,
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
  const uniqueRecordTotal = recordRows.reduce((sum, record) => sum + record.uniqueTotal, 0);
  const totalRecords = recordRows.reduce((sum, record) => sum + record.value, 0);
  const combatLevel = getCombatLevel(account);
  const totalSkillLevelCap = skills.length * 120;
  const collectionPercent = getPercent(collectionCurrent, collectionTotal) ?? 0;

  return {
    overviewStats: [
      createOverviewStat('Combat Level', combatLevel.toFixed(2), combatLevel, combatLevelTotal),
      createOverviewStat('Total Skill Level', totalSkillLevel.toLocaleString(), totalSkillLevel, totalSkillLevelCap),
      createOverviewStat('Skills at 99', skillsAt99.toLocaleString(), skillsAt99, skills.length),
      createOverviewStat('Skills at 120', skillsAt120.toLocaleString(), skillsAt120, skills.length),
      createOverviewStat('Total Quests', questTotals.completed.toLocaleString(), questTotals.completed, null),
      createOverviewStat('Quest Points', questTotals.points.toLocaleString(), questTotals.points, null),
      createOverviewStat(
        'Achievements',
        totalAchievements > 0 ? formatRatio(completedAchievements, totalAchievements) : completedAchievements.toLocaleString(),
        completedAchievements,
        totalAchievements > 0 ? totalAchievements : null,
      ),
      createOverviewStat('Achievement Points', achievementPoints.toLocaleString(), achievementPoints, null),
      createOverviewStat('Unique Records', formatRatio(uniqueRecords, uniqueRecordTotal), uniqueRecords, uniqueRecordTotal),
      createOverviewStat('Records', totalRecords.toLocaleString(), totalRecords, null),
      createOverviewStat(
        'Collection',
        collectionTotal > 0 ? formatRatio(collectionCurrent, collectionTotal) : collectionCurrent.toLocaleString(),
        collectionCurrent,
        collectionTotal > 0 ? collectionTotal : null,
      ),
      createOverviewStat('Collection %', `${collectionPercent.toFixed(3)}%`, collectionCurrent, collectionTotal > 0 ? collectionTotal : null),
    ],
    collectionCategories,
    recordRows,
    achievementCategories,
  };
};

export const getCodexPercent = (current: number, total: number) => getPercent(current, total) ?? 0;

export const getCodexPercentLabel = (current: number, total: number) => getPercentLabel(current, total) ?? '0.000%';
