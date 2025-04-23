'use client';

import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export default function HomePage() {
  const [fcmToken, setFcmToken] = useState('');
  const [incoming, setIncoming] = useState(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [permissionRequested, setPermissionRequested] = useState(false);

  const AUTH_TOKEN = 'YOUR_AUTH_TOKEN'; // replace with your real token

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // Foreground message handler
    onMessage(messaging, (payload) => {
      setIncoming(payload.notification);
    });

    // Optional: auto-check if permission already granted
    if (Notification.permission === 'granted') {
      registerServiceWorkerAndGetToken(messaging);
    }
  }, []);

  const registerServiceWorkerAndGetToken = async (messagingInstance) => {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const currentToken = await getToken(messagingInstance, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        setFcmToken(currentToken);
        // Send token to backend
        await fetch('https://efa3-119-82-104-94.ngrok-free.app/api/auth/save-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: JSON.stringify({ token: currentToken }),
        });
      } else {
        console.log('No registration token available');
      }
    } catch (error) {
      console.error('Token or registration error:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.');
      return;
    }

    setPermissionRequested(true);

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      await registerServiceWorkerAndGetToken(messaging);
    } else {
      alert('Notifications not allowed');
    }
  };

  const sendBroadcast = async () => {
    setSending(true);
    setStatus('');
    try {
      const res = await fetch('https://efa3-119-82-104-94.ngrok-free.app/api/send-notification', {
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
      <h1>🔥 Push Notification Demo</h1>

      <section style={{ margin: '2rem 0' }}>
        <h2>🔐 Notification Permission</h2>
        {Notification.permission === 'granted' ? (
          <p style={{ color: 'green' }}>Notifications allowed ✅</p>
        ) : (
          <button
            onClick={requestNotificationPermission}
            style={{
              padding: '0.6rem 1rem',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Enable Notifications
          </button>
        )}
      </section>

      <section style={{ margin: '2rem 0' }}>
        <h2>📲 FCM Token</h2>
        <textarea
          readOnly
          value={fcmToken}
          rows={3}
          style={{ width: '100%', fontSize: '0.85rem' }}
        />
      </section>

      <section style={{ margin: '2rem 0' }}>
        <h2>📥 Incoming Notification</h2>
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
        <h2>📡 Admin Broadcast</h2>
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
