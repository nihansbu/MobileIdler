import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { AccountSetup } from './screens/AccountSetup';
import { AccountScreen } from './screens/AccountScreen';
import { ActivitiesScreen } from './screens/ActivitiesScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SkillsScreen } from './screens/SkillsScreen';
import { createDefaultAccount, loadAccount, parseAccountBackup, resetAccount, saveAccount } from './game/save';
import { canUnlockSecondSlot, resolveCompletedActivities } from './game/simulation';
import { getActivity } from './game/content';
import { areRequirementsMet } from './game/requirements';
import {
  findHigherPriorityIdleCharacterId,
  findLowerPriorityIdleCharacterId,
  findNextIdleCharacterAfterStart,
  getActiveCharacter,
  moveRosterSlot,
  placeCharacterInRosterSlot,
} from './game/roster';
import { getCombatLevel } from './game/skills';
import type { AccountSave, ActivityId, CharacterSave, ViewId } from './types';

export function App() {
  const [account, setAccount] = useState<AccountSave | null>(() => {
    const loaded = loadAccount();
    return loaded ? resolveCompletedActivities(loaded) : null;
  });
  const [activeView, setActiveView] = useState<ViewId>('account');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (account) {
      saveAccount(account);
    }
  }, [account]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);
      setAccount((current) => (current ? resolveCompletedActivities(current, currentTime) : current));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const updateAccount = (updater: (account: AccountSave) => AccountSave) => {
    setAccount((current) => (current ? updater(current) : current));
  };

  if (!account) {
    return <AccountSetup onCreate={(accountName) => setAccount(createDefaultAccount(accountName))} />;
  }

  const activeCharacter = getActiveCharacter(account);
  const higherPriorityIdleCharacterId = findHigherPriorityIdleCharacterId(account, activeCharacter?.id ?? account.activeCharacterId);
  const lowerPriorityIdleCharacterId = findLowerPriorityIdleCharacterId(account, activeCharacter?.id ?? account.activeCharacterId);
  const combatLevel = getCombatLevel(account);

  const createCharacter = (character: CharacterSave, slotIndex?: number) => {
    updateAccount((current) => ({
      ...placeCharacterInRosterSlot(
        {
          ...current,
          activeCharacterId: current.activeCharacterId ?? character.id,
          characters: [...current.characters, character],
        },
        character.id,
        slotIndex,
      ),
    }));
    setActiveView('account');
  };

  const startActivity = (activityId: ActivityId) => {
    updateAccount((current) => {
      const activity = getActivity(activityId);
      const characterId = current.activeCharacterId;
      const character = current.characters.find((candidate) => candidate.id === characterId);
      if (!characterId || !character || character.activity || current.rap < activity.rapCost || !areRequirementsMet(current, activity.requirements)) {
        return current;
      }

      const now = Date.now();
      const updatedAccount = {
        ...current,
        rap: current.rap - activity.rapCost,
        characters: current.characters.map((character) =>
          character.id === characterId
            ? {
                ...character,
                activity: {
                  activityId,
                  startedAt: now,
                  endsAt: now + activity.durationMinutes * 60 * 1000,
                  rapCost: activity.rapCost,
                  resolvedTicks: 0,
                },
              }
            : character,
        ),
      };

      return {
        ...updatedAccount,
        activeCharacterId: findNextIdleCharacterAfterStart(updatedAccount, characterId),
      };
    });
    setActiveView('account');
  };

  const unlockSlot = () => {
    updateAccount((current) => {
      if (!canUnlockSecondSlot(current)) {
        return current;
      }
      return {
        ...current,
        rap: current.rap - 2000,
        characterSlots: current.characterSlots + 1,
      };
    });
  };

  const selectActiveCharacter = (characterId: string | null) => {
    if (!characterId) {
      return;
    }

    updateAccount((current) => ({
      ...current,
      activeCharacterId: current.characters.some((character) => character.id === characterId) ? characterId : current.activeCharacterId,
    }));
  };

  const moveRosterCharacter = (fromIndex: number, toIndex: number) => {
    updateAccount((current) => moveRosterSlot(current, fromIndex, toIndex));
  };

  const hardReset = () => {
    resetAccount();
    setAccount(null);
    setActiveView('account');
  };

  const importBackup = (rawBackup: string) => {
    const importedAccount = resolveCompletedActivities(parseAccountBackup(rawBackup));
    setAccount(importedAccount);
    setActiveView('progress');
  };

  return (
    <AppShell
      accountName={account.accountName}
      rap={account.rap}
      activeCharacter={activeCharacter}
      combatLevel={combatLevel}
      canSelectHigherPriority={Boolean(higherPriorityIdleCharacterId)}
      canSelectLowerPriority={Boolean(lowerPriorityIdleCharacterId)}
      activeView={activeView}
      onAddRap={() => updateAccount((current) => ({ ...current, rap: current.rap + 10000 }))}
      onSelectHigherPriority={() => selectActiveCharacter(higherPriorityIdleCharacterId)}
      onSelectLowerPriority={() => selectActiveCharacter(lowerPriorityIdleCharacterId)}
      onNavigate={setActiveView}
    >
      {activeView === 'account' && (
        <AccountScreen
          account={account}
          now={now}
          activeCharacterId={activeCharacter?.id ?? null}
          onCreateCharacter={createCharacter}
          onUnlockSlot={unlockSlot}
          onAssignActivity={() => setActiveView('activities')}
          onMoveRosterCharacter={moveRosterCharacter}
          onSelectCharacter={selectActiveCharacter}
        />
      )}
      {activeView === 'activities' && <ActivitiesScreen account={account} activeCharacter={activeCharacter} onStartActivity={startActivity} />}
      {activeView === 'skills' && <SkillsScreen account={account} />}
      {activeView === 'progress' && <ProgressScreen account={account} onImportBackup={importBackup} onReset={hardReset} />}
    </AppShell>
  );
}
