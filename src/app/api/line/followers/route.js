export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    // Get the start parameter from the query
    const start = req.query.start ? `&start=${req.query.start}` : '';
  
    try {
      const response = await fetch(`https://api.line.me/v2/bot/followers/ids?limit=1000${start}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer 20907b573e90541b8cbb864488ce847a',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: errorText });
      }
  
      const data = await response.json();
      return res.status(200).json(data);
  
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  