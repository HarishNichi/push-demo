// app/api/line-webhook/route.js

export async function POST(req) {
  try {
    const body = await req.json();

    for (const event of body.events) {
      if (event.type === 'follow') {
        const userId = event.source.userId;
        console.log('🟢 New user followed us:', userId);

        // Optionally, you can save or do other logic with the userId

        // You can then send the userId to your frontend or return it as part of the response
        return new Response(
          JSON.stringify({ userId }), 
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
