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

    fetch('https://api.hinanjo.nichi.in/api/line/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => 
        res.json()
    )
      .then(({ profile }) => {
         console.log('Profile:', profile);
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
          Scan the QR code below to add me as a friend on LINE and start receiving notifications.
        </p>
        <img
          src="https://qr-official.line.me/gs/M_349fkpgg_GW.png" // Replace with your LINE QR code URL
          alt="Add Me on LINE QR Code"
          style={styles.qrCode}
        />
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
    display: 'flex', // Flexbox for centering content
    flexDirection: 'column',
    alignItems: 'center', // Center content horizontally
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
    display: 'flex', // Flexbox for centering content
    flexDirection: 'column',
    alignItems: 'center', // Center content horizontally
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
  qrCode: {
    width: '200px',
    height: '200px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    objectFit: 'contain',
  },
};