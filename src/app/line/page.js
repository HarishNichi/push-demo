'use client';

import { useEffect, useState } from 'react';

export default function LineCallback() {
  const [code, setCode] = useState(null);
  const [profile, setProfile] = useState(null);

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
      .then((res) => res.json())
      .then(({ profile }) => {
        setProfile(profile);
      })
      .catch(console.error);
  }, [code]);

  if (!profile) return <p style={styles.loading}>Loading profile…</p>;

  return (
    <div style={styles.container}>
      <div style={styles.profileSection}>
        <h1 style={styles.heading}>Welcome, {profile.displayName}</h1>
        <img
          src={profile.pictureUrl || '/default-avatar.png'} // Default avatar if no image
          alt="avatar"
          style={styles.avatar}
        />
        <p style={styles.userId}>
          <strong>User ID:</strong> {profile.userId}
        </p>
      </div>
      <div style={styles.addFriendSection}>
        <h2 style={styles.addFriendHeading}>Add Me as a Friend</h2>
        <p style={styles.addFriendText}>
          Click the button below to add me as a friend on LINE and start receiving notifications.
        </p>
        <a
          href="https://line.me/R/ti/p/@349fkpgg"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.addFriendButton}
        >
          Add Me on LINE
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row', // Align profile and add friend sections side by side
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    gap: '2rem',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  profileSection: {
    textAlign: 'center',
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '1rem',
    objectFit: 'cover',
    backgroundColor: '#f0f0f0', // Light gray background for empty avatar
  },
  userId: {
    fontSize: '1rem',
    color: '#555',
  },
  loading: {
    fontSize: '1.25rem',
    color: '#666',
    textAlign: 'center',
    marginTop: '2rem',
  },
  addFriendSection: {
    textAlign: 'center',
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '400px',
  },
  addFriendHeading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  addFriendText: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#555',
  },
  addFriendButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#00c300', // LINE green color
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  addFriendButtonHover: {
    backgroundColor: '#009a00', // Darker green for hover
  },
};