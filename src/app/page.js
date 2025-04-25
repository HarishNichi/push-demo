'use client';

// import { useEffect, useState } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// export default function HomePage() {
//   const [fcmToken, setFcmToken] = useState('');
//   const [incoming, setIncoming] = useState(null);
//   const [sending, setSending] = useState(false);
//   const [status, setStatus] = useState('');
//   const [isSafari, setIsSafari] = useState(false);

//   // Your authorization token for API requests
//   const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvYWRtaW4vbG9naW4iLCJpYXQiOjE3NDU0MDQzMDcsImV4cCI6MTc0NTQ5MDcwNywibmJmIjoxNzQ1NDA0MzA3LCJqdGkiOiJHRHdsUDJ5dHBydjQwZkhuIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.Gu5-UJTqyg3Brh6C--d_IKJWzpGSgX5rjPBdJ2Gw7xc";  // Replace with your actual auth token
//   // Replace with your actual auth token

//   const API_URL = "https://efa3-119-82-104-94.ngrok-free.app";  // Replace with your actual API URL

  
//   const firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//     measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
//   };



//   // Detect Safari
//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const app = initializeApp(firebaseConfig);
//     const messaging = getMessaging(app);
//     const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
//     setIsSafari(isSafariBrowser);

//     if (!isSafariBrowser) {
//       // Normal FCM logic for Chrome, Firefox, etc.
//       navigator.serviceWorker
//         .register('/firebase-messaging-sw.js')
//         .then((registration) => {
//           Notification.requestPermission().then((perm) => {
//             if (perm === 'granted') {
//               getToken(messaging, {
//                 vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
//                 serviceWorkerRegistration: registration,
//               }).then((token) => {
//                 setFcmToken(token);
//                 saveTokenToServer(token);
//               });
//             }
//           });
//         });

//       onMessage(messaging, (payload) => {
//         setIncoming(payload.notification);
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const app = initializeApp(firebaseConfig);
//     const messaging = getMessaging(app);
//     const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
//     setIsSafari(isSafariBrowser);

//     if (isSafariBrowser) {
//       onMessage(messaging, (payload) => {
//         setIncoming(payload.notification);
//       });
//     }
//   }, []);

//   // Manual permission + token save for Safari
//   const handleSafariPermission = async () => {
//     const permission = await Notification.requestPermission();
//     if (permission === 'granted') {
//       try {
//         const app = initializeApp(firebaseConfig);
//         const messaging = getMessaging(app);
//         const token = await getToken(messaging, {
//           vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
//         });
//         setFcmToken(token);
//         saveTokenToServer(token);
//       } catch (err) {
//         console.error('Error getting token in Safari:', err);
//       }
//     } else {
//       alert('Notifications not allowed!');
//     }
//   };

//   const saveTokenToServer = (token) => {
//     fetch(`${API_URL}/api/auth/save-token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${AUTH_TOKEN}`,
//       },
//       body: JSON.stringify({ token }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log('Token saved:', data);
//       })
//       .catch((error) => {
//         console.error('Error saving token:', error);
//       });
//   };

//   const sendBroadcast = async () => {
//     setSending(true);
//     setStatus('');
//     try {
//       const res = await fetch(`${API_URL}/api/send-notification`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${AUTH_TOKEN}`,
//         },
//         body: JSON.stringify({
//           token: fcmToken,
//           title: '🚀 Broadcast Message',
//           body: 'This is sent to all users!',
//         }),
//       });
//       const data = await res.json();
//       setStatus('Broadcast sent ✔️');
//       console.log(data);
//     } catch (err) {
//       console.error(err);
//       setStatus('Failed to send 😞');
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
//       <h1>🔥 Push Demo (User & Admin)</h1>

//       <section style={{ margin: '2rem 0' }}>
//         <h2>User Registration</h2>
//         {isSafari && (
//           <button
//             onClick={handleSafariPermission}
//             style={{ padding: '0.5rem 1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}
//           >
//             Enable Notifications (Safari)
//           </button>
//         )}
//         <p>
//           <strong>Your FCM Token:</strong>
//         </p>
//         <textarea
//           readOnly
//           value={fcmToken}
//           rows={3}
//           style={{ width: '100%', fontSize: '0.85rem' }}
//         />
//       </section>

//       <section style={{ margin: '2rem 0' }}>
//         <h2>Incoming Notification</h2>
//         {incoming ? (
//           <div style={{ padding: '1rem', background: '#f0f0f0' }}>
//             <p><strong>{incoming.title}</strong></p>
//             <p>{incoming.body}</p>
//           </div>
//         ) : (
//           <p>No notifications yet...</p>
//         )}
//       </section>

//       <section style={{ margin: '2rem 0' }}>
//         <h2>Admin Broadcast</h2>
//         <button
//           onClick={sendBroadcast}
//           disabled={sending}
//           style={{
//             padding: '0.75rem 1.5rem',
//             fontSize: '1rem',
//             background: sending ? '#ccc' : '#0070f3',
//             color: '#fff',
//             border: 'none',
//             borderRadius: 4,
//             cursor: sending ? 'default' : 'pointer',
//           }}
//         >
//           {sending ? 'Sending…' : 'Send Push Notification to All Users'}
//         </button>
//         {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
//       </section>
//     </div>
//   );
// }

// pages/index.tsx

export default function Home() {
  const loginWithLine = () => {
    const state = "abc123"; // You can generate random
    const nonce = "xyz456"; // Should also be random for security
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_LINE_CALLBACK_URL);
    const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;

    // const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CHANNEL_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINE_CALLBACK_URL}&state=abc123&scope=profile%20openid&bot_prompt=normal`;
    const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CHANNEL_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINE_CALLBACK_URL}&state=random123&bot_prompt=normal&scope=profile%20openid`;



    window.location.href = loginUrl;
  };

  return (
    <main>
      <h1>LINE Login Demo</h1>
      <button onClick={loginWithLine}>Login with LINE</button>
    </main>
  );
}


