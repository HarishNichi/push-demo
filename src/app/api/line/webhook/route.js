// app/api/line-webhook/route.js

export async function POST(req) {
  try {
    const body = await req.json();  // Receive the webhook data

    for (const event of body.events) {
      if (event.type === 'follow') {
        const userId = event.source.userId;  // Extract userId from the webhook data
        console.log('🟢 New user followed us:', userId);  // Log the userId

        // Optionally, you can save the userId to your database or return it in the response

        return new Response(
          JSON.stringify({ userId }),  // Send back the userId in the response
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Webhook Error:', err);
    return new Response('Webhook error', { status: 500 });
  }
}
