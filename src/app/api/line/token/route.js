// src/app/api/line/token/route.js
import axios from 'axios';
import https from 'https';

export async function POST(req) {
  try {
    const { code } = await req.json();

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.NEXT_PUBLIC_LINE_CALLBACK_URL);
    params.append('client_id', process.env.NEXT_PUBLIC_LINE_CHANNEL_ID);
    params.append('client_secret', process.env.LINE_CHANNEL_SECRET);

    // Create an HTTPS agent that disables certificate validation
    const agent = new https.Agent({ rejectUnauthorized: false });

    const { data } = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'LINE-NextJS-App/1.0',
        },
        httpsAgent: agent,
      }
    );

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('LINE Token Error:', err?.response?.data || err);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: err.message }),
      { status: 500 }
    );
  }
}
