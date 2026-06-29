import { Panel, Stat } from '../components/ui';
import { skills } from '../data/skills';
import { getCombatLevel, getNextLevelXp, getSkillLevel, getSkillXp, getTotalLevel, isSkillUnlocked, xpForLevel } from '../game/skills';
import type { AccountSave } from '../types';

interface SkillsScreenProps {
  account: AccountSave;
}

export function SkillsScreen({ account }: SkillsScreenProps) {
  const combatLevel = getCombatLevel(account);
  const totalLevel = getTotalLevel(account);

  return (
    <>
      <h1 className="screen-title skills-title">Skills</h1>
      <Panel className="summary-grid skill-summary">
        <Stat label="Combat" value={combatLevel.toFixed(2)} />
        <Stat label="Total" value={totalLevel} />
      </Panel>

      <section className="skills-section">
        <div className="skill-grid">
          {skills.map((skill) => {
            const xp = getSkillXp(account, skill.id);
            const level = getSkillLevel(account, skill.id);
            const nextLevelXp = getNextLevelXp(level);
            const currentLevelXp = xpForLevel(level);
            const unlocked = isSkillUnlocked(account, skill.id);
            const xpToNext = level >= 120 ? 0 : Math.max(0, nextLevelXp - xp);
            const progress =
              level >= 120 ? 100 : Math.max(0, Math.min(100, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

            return (
              <div key={skill.id} className={unlocked ? 'skill-tile' : 'skill-tile locked-skill'}>
                <div className="skill-tile-head">
                  <strong>{skill.name}</strong>
                  <span>{level}</span>
                </div>
                <div className="mini-progress" aria-label={`${skill.name} XP to next level`}>
                  <div className="mini-progress-fill" style={{ width: `${progress}%` }} />
                  <span>{unlocked ? (level >= 120 ? 'Max' : xpToNext.toLocaleString()) : `TL ${skill.unlockTotalLevel}`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
