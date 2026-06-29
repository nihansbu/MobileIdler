import { useState } from 'react';
import { Button, Panel } from '../components/ui';

interface AccountSetupProps {
  onCreate: (accountName: string) => void;
}

export function AccountSetup({ onCreate }: AccountSetupProps) {
  const [name, setName] = useState('LuckyBoo');

  return (
    <div className="setup-screen">
      <Panel className="setup-panel">
        <span className="kicker">MobileIdler MVP</span>
        <h1>Choose Account</h1>
        <p>Local save profile. No login, no server, no sync yet.</p>
        <label className="field">
          <span>Account name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} maxLength={24} />
        </label>
        <Button onClick={() => onCreate(name.trim() || 'LuckyBoo')}>Start</Button>
      </Panel>
    </div>
  );
}
