import axios from 'axios';
import https from 'https';

export async function POST(req) {
  try {
    const { code } = await req.json();

    // 1) Exchange code for tokens
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.NEXT_PUBLIC_LINE_CALLBACK_URL,
      client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
      client_secret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET,
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

    // Now that the user has logged in and we have their userId, we can send a message
    const sendMessage = async (userId) => {
      const message = {
        to: userId,  // The LINE user ID of the person
        messages: [
          {
            type: 'text',
            text: 'Hello, welcome to our service!',
          },
        ],
      };

      try {
        const response = await axios.post(
          'https://api.line.me/v2/bot/message/push',
          message,
          {
            headers: {
              'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,  // Your bot's access token
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Message sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
      }
    };

    // Send message to the user
    await sendMessage(profile.userId);

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
