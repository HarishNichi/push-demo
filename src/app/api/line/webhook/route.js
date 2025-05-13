import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

// Helper function to verify the LINE webhook signature
const verifySignature = (body, signature) => {
  const hash = crypto
    .createHmac('sha256', CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  return hash === signature;
};

export async function POST(req) {
  try {
    // Step 1: Get the X-LINE-SIGNATURE header
    const signature = req.headers.get('X-LINE-SIGNATURE');
    if (!signature) {
      return new NextResponse('Signature not found', { status: 400 });
    }

    // Step 2: Get the raw body of the request (as text, not JSON)
    const body = await req.text(); // We use `.text()` to get the raw body for signature verification

    // Step 3: Verify the signature
    if (!verifySignature(body, signature)) {
      return new NextResponse('Invalid signature', { status: 403 });
    }

    // Step 4: Parse the body as JSON to process events
    const eventData = JSON.parse(body);

    // Log the event for debugging
    console.log('Received event data:', eventData);

    // Process the event (Example: Get userId from the 'follow' event)
    for (const event of eventData.events) {
      if (event.type === 'follow') {
        const userId = event.source.userId;
        localStorage.setItem('userId', userId); // Store the userId in local storage
        console.log('🟢 New user followed us:', userId);
        // Optionally save or process the userId
      }
    }

    // Respond back to LINE with "OK"
    return new NextResponse('OK', { status: 200 });
  } catch (err) {
    console.error('Error processing the webhook:', err);
    return new NextResponse('Error processing the webhook', { status: 500 });
  }
}
