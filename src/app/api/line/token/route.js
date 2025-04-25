// src/app/api/line/token/route.js
import axios from 'axios';
import https from 'https';

export async function POST(req) {
  try {
    const { code } = await req.json();

    // 1) Exchange code for tokens
    const params = new URLSearchParams({
      grant_type:   'authorization_code',
      code,
      redirect_uri: process.env.NEXT_PUBLIC_LINE_CALLBACK_URL,
      client_id:    process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
      client_secret:process.env.NEXT_PUBLIC_LINE_CALLBACK_URL,
    });

    // (Optional) disable cert checks locally
    const agent = new https.Agent({ rejectUnauthorized: false });

    const tokenRes = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        httpsAgent: agent,
      }
    );
    const tokenData = tokenRes.data;
    localStorage.setItem('lineToken', JSON.stringify(tokenData)); // Store token in local storage

    return new Response(
      JSON.stringify({ tokenData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

    // 2) Fetch the user profile using the access token
    const profileRes = await axios.get(
      'https://api.line.me/v2/profile',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        httpsAgent: agent,
      }
    );
    const profile = profileRes.data;

    // 3) Return both token info and profile
    return new Response(
      JSON.stringify({ tokenData, profile }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('LINE Token/Profile Error:', err.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
