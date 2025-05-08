'use client';

import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export default function Home() {
  const [fcmToken, setFcmToken] = useState('');
  const [incoming, setIncoming] = useState(null);
  const [isSafari, setIsSafari] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

    // Your authorization token for API requests
  const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvYWRtaW4vbG9naW4iLCJpYXQiOjE3NDU0MDQzMDcsImV4cCI6MTc0NTQ5MDcwNywibmJmIjoxNzQ1NDA0MzA3LCJqdGkiOiJHRHdsUDJ5dHBydjQwZkhuIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.Gu5-UJTqyg3Brh6C--d_IKJWzpGSgX5rjPBdJ2Gw7xc";  // Replace with your actual auth token
  // Replace with your actual auth token

  const API_URL = "https://efa3-119-82-104-94.ngrok-free.app";  // Replace with your actual API URL


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
      getCode();
  }
  , []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(isSafariBrowser);

    if (!isSafariBrowser) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          Notification.requestPermission().then((perm) => {
            if (perm === 'granted') {
              getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
                serviceWorkerRegistration: registration,
              }).then((token) => {
                setFcmToken(token);
                saveTokenToServer(token); // Save the token to the server
              });
            }
          });
        });

      onMessage(messaging, (payload) => {
        setIncoming(payload.notification);
      });
    }
  }, []);

  const saveTokenToServer = (token) => {
    fetch(`${API_URL}/api/auth/save-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Token saved:', data);
      })
      .catch((error) => {
        console.error('Error saving token:', error);
      });
  };

  const sendBroadcast = async () => {
    setSending(true);
    setStatus('');
    try {
      const res = await fetch(`${API_URL}/api/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
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

  const loginWithLine = () => {
    const state = "abc123";
    const nonce = "xyz456";
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_LINE_CALLBACK_URL);
    const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;

    const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&bot_prompt=normal&scope=profile%20openid`;

    window.location.href = loginUrl;
  };

  const getCode = async () => {
    try {
      const res = await fetch(`/api/line/followers`);
  
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
  
      const data = await res.json();
      console.log('Followers data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h2>🔥 Firebase Notifications</h2>
        {isSafari && (
          <button
            onClick={() => Notification.requestPermission()}
            style={styles.button}
          >
            Enable Notifications (Safari)
          </button>
        )}
        <button
          onClick={sendBroadcast} // Call sendBroadcast on button click
          disabled={sending}
          style={{
            ...styles.button,
            backgroundColor: sending ? '#ccc' : '#0070f3',
            cursor: sending ? 'default' : 'pointer',
          }}
        >
          {sending ? 'Sending…' : 'Push Notification'}
        </button>
        <p><strong>Your FCM Token:</strong></p>
        <textarea
          readOnly
          value={fcmToken}
          rows={3}
          style={styles.textarea}
        />
        <h3>Incoming Notification</h3>
        {incoming ? (
          <div style={styles.notification}>
            <p><strong>{incoming.title}</strong></p>
            <p>{incoming.body}</p>
          </div>
        ) : (
          <p>No notifications yet...</p>
        )}
        {status && <p style={styles.status}>{status}</p>}
      </div>

      <div style={styles.section}>
        <h2>LINE Login</h2>
        <p>Sign in with LINE to access your profile and more.</p>
        <button onClick={loginWithLine} style={styles.button}>
          Login with LINE
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch', // Ensures equal height for both sections
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    gap: '2rem',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  section: {
    flex: 1,
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Ensures content is spaced evenly
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s ease',
  },
  textarea: {
    width: '100%',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'none',
  },
  notification: {
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginTop: '1rem',
  },
  status: {
    marginTop: '1rem',
    fontSize: '1rem',
    color: '#0070f3',
  },
};