import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { AccountSetup } from './screens/AccountSetup';
import { AccountScreen } from './screens/AccountScreen';
import { ActivitiesScreen } from './screens/ActivitiesScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { createDefaultAccount, loadAccount, parseAccountBackup, resetAccount, saveAccount } from './game/save';
import { canUnlockSecondSlot, resolveCompletedActivities } from './game/simulation';
import { getActivity } from './game/content';
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

  const createCharacter = (character: CharacterSave) => {
    updateAccount((current) => ({
      ...current,
      characters: [...current.characters, character],
    }));
    setActiveView('account');
  };

  const startActivity = (characterId: string, activityId: ActivityId) => {
    updateAccount((current) => {
      const activity = getActivity(activityId);
      if (current.rap < activity.rapCost) {
        return current;
      }

      const now = Date.now();
      return {
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
                },
              }
            : character,
        ),
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
      activeView={activeView}
      onAddRap={() => updateAccount((current) => ({ ...current, rap: current.rap + 10000 }))}
      onNavigate={setActiveView}
    >
      {activeView === 'account' && (
        <AccountScreen
          account={account}
          now={now}
          onCreateCharacter={createCharacter}
          onUnlockSlot={unlockSlot}
          onAssignActivity={() => setActiveView('activities')}
        />
      )}
      {activeView === 'activities' && <ActivitiesScreen account={account} onStartActivity={startActivity} />}
      {activeView === 'progress' && <ProgressScreen account={account} onImportBackup={importBackup} onReset={hardReset} />}
    </AppShell>
  );
}
