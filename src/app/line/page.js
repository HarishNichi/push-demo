'use client';

import { useEffect, useState } from 'react';

export default function LineCallback() {
  const [code, setCode] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    // Extract the 'code' parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const codeParam = searchParams.get('code');
    setCode(codeParam);
  }, []);

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