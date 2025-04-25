"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LineCallback() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const code = searchParams.getAll("code").pop();
    if (!code) return;

    fetch("/api/line/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile);
        else console.error(data);
      })
      .catch(console.error);
  }, [searchParams]);

  if (!profile) return <p>Loading profile…</p>;

  return (
    <div>
      <h1>Welcome, {profile.displayName}</h1>
      <img src={profile.pictureUrl} alt="avatar" width={80} />
      <p>User ID: {profile.userId}</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LineCallback />
    </Suspense>
  );
}