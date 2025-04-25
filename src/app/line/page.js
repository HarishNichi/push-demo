"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LineCallback() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const code = searchParams.getAll('code').pop();
  // const state = searchParams.getAll('state').pop();

    if (!code) return;

    fetch("/api/line/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    .then(r => r.json())
    .then(data => {
      if (data.profile) setProfile(data.profile);
      else console.error(data);
    })
    .catch(console.error);
  }, []);

  if (!profile) return <p>Loading profile…</p>;

  return (
    <div>
      <h1>Welcome, {profile.displayName}</h1>
      <img src={profile.pictureUrl} alt="avatar" width={80} />
      <p>User ID: {profile.userId}</p>
    </div>
  );
}

