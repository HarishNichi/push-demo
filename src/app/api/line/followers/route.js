export async function GET(req) {
    // Get the start parameter from the query
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start') ? `&start=${searchParams.get('start')}` : '';
  
    try {
      const response = await fetch(`https://api.line.me/v2/bot/followers/ids?limit=1000${start}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer f4OaU6J5m9H2Rwkmme7jMqJsRJ9+GlTfAqC+qR93Y7k2IAh+I+JbZEaE8gPQ1YLTF5hrMoqP4mmulONKphRKyjIGjjPnY+NCPGzjSRNBM3+rpYgyTdrPA9uBr9hHafFguNWM5oeJyqhHWiSLfxTE5AdB04t89/1O/w1cDnyilFU=',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: errorText }), { status: response.status });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }