// pages/index.js
'use client';

import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export default function HomePage() {
  const [fcmToken, setFcmToken] = useState('');
  const [incoming, setIncoming] = useState(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvYWRtaW4vbG9naW4iLCJpYXQiOjE3NDUzMTU2OTAsImV4cCI6MTc0NTQwMjA5MCwibmJmIjoxNzQ1MzE1NjkwLCJqdGkiOiJVOEI3emNkZ3dCTTRSVFc5Iiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.IGpW8SlxKekHvUHeyeA7bGRc-QguvCIBVSAi6VDqcgg";

  // Initialize Firebase & Messaging
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // Register SW, request permission & get token
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
              serviceWorkerRegistration: registration,
            })
              .then((token) => {
                if (token) {
                  setFcmToken(token);
                  // send to backend
                  fetch('https://192.168.1.74:8000/api/auth/save-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${AUTH_TOKEN}`, },
                    body: JSON.stringify({ token }),
                  });
                }
              })
              .catch(console.error);
          }
        });
      })
      .catch(console.error);

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      setIncoming(payload.notification);
    });
  }, []);

  const sendBroadcast = async () => {
    setSending(true);
    setStatus('');
    try {
      const res = await fetch('https://192.168.1.74:8000/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: fcmToken,
          title: '🚀 Broadcast Message',
          body: 'This is sent to all users!',
        }),
      });
      const data = await res.json();
      setStatus('Broadcast sent ✔️');
      console.log(data);
    } catch (err) {
      console.error(err);
      setStatus('Failed to send 😞');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>🔥 Push Demo (User & Admin)</h1>

      <section style={{ margin: '2rem 0' }}>
        <h2>User Registration</h2>
        <p>
          <strong>Your FCM Token:</strong>
        </p>
        <textarea
          readOnly
          value={fcmToken}
          rows={3}
          style={{ width: '100%', fontSize: '0.85rem' }}
        />
      </section>

      <section style={{ margin: '2rem 0' }}>
        <h2>Incoming Notification</h2>
        {incoming ? (
          <div style={{ padding: '1rem', background: '#f0f0f0' }}>
            <p><strong>{incoming.title}</strong></p>
            <p>{incoming.body}</p>
          </div>
        ) : (
          <p>No notifications yet...</p>
        )}
      </section>

      <section style={{ margin: '2rem 0' }}>
        <h2>Admin Broadcast</h2>
        <button
          onClick={sendBroadcast}
          disabled={sending}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: sending ? '#ccc' : '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: sending ? 'default' : 'pointer',
          }}
        >
          {sending ? 'Sending…' : 'Send Push Notification to All Users'}
        </button>
        {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
      </section>
    </div>
  );
}
