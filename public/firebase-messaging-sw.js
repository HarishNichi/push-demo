// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAFrpwGhOXMGHO1lDUmJdyfQpM4Cg3IMX8",
  authDomain: "pushnotification-8ae9c.firebaseapp.com",
  projectId: "pushnotification-8ae9c",
  storageBucket: "pushnotification-8ae9c.firebasestorage.app",
  messagingSenderId: "357688663947",
  appId: "1:357688663947:web:ead0a32bf42285fd5f998e",
  measurementId: "G-NM797XRW9Z"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
