'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LineCallback() {
  const params = useSearchParams();
  const code   = params.get('code');
  const [profile, setProfile] = useState(null);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    if (!code) return;

    fetch('/api/line/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    .then(res => res.json())
    .then(({ tokenData, profile }) => {
      setTokenData(tokenData);
      setProfile(profile);
    })
    .catch(console.error);
  }, [code]);

  if (!profile) return <p>Loading profile…</p>;

  return (
    <div>
      <h1>Welcome, {profile.displayName}</h1>
      <img src={profile.pictureUrl} alt="avatar" width={80} />
      <p>User ID: {profile.userId}</p>
      <pre style={{ fontSize: '0.75rem' }}>
        {JSON.stringify({ tokenData }, null, 2)}
      </pre>
    </div>
  );
}
