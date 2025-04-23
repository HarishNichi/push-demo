"use client";
import { useState } from "react";

export default function HomePage2() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendNotification = async () => {
    try {
      const res = await fetch("https://192.168.1.74:8000/api/line/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_LARAVEL_JWT_TOKEN"
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setStatus(data.status ? "✅ Sent!" : "❌ Failed to send");
    } catch (err) {
      setStatus("❌ Error occurred");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>LINE Push Notification</h1>
      <textarea
        rows={4}
        cols={50}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter notification message"
      />
      <br />
      <button onClick={sendNotification} style={{ marginTop: 10 }}>
        Send Notification
      </button>
      <p>{status}</p>
    </div>
  );
}
