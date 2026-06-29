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
      <h1 className="screen-title">Skills</h1>
      <Panel className="summary-grid">
        <Stat label="Combat" value={combatLevel.toFixed(2)} />
        <Stat label="Req" value={Math.floor(combatLevel)} />
        <Stat label="Total" value={totalLevel} />
      </Panel>

      <section className="section">
        <h2>Account Skills</h2>
        <div className="skill-list">
          {skills.map((skill) => {
            const xp = getSkillXp(account, skill.id);
            const level = getSkillLevel(account, skill.id);
            const nextLevelXp = getNextLevelXp(level);
            const currentLevelXp = xpForLevel(level);
            const unlocked = isSkillUnlocked(account, skill.id);
            const progress =
              level >= 120 ? 100 : Math.max(0, Math.min(100, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

            return (
              <Panel key={skill.id} className={unlocked ? 'skill-row' : 'skill-row locked-skill'}>
                <div className="skill-row-main">
                  <div>
                    <strong>{skill.name}</strong>
                    <span>{skill.category}</span>
                  </div>
                  <div className="skill-level">
                    <span>Level</span>
                    <strong>{level}</strong>
                  </div>
                </div>
                <div className="progress-block">
                  <div className="progress-label">
                    <span>{unlocked ? `${xp.toLocaleString()} XP` : `Locked until Total Level ${skill.unlockTotalLevel}`}</span>
                    <span>{level >= 120 ? 'Max level' : `${nextLevelXp.toLocaleString()} next`}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      </section>
    </>
  );
}
