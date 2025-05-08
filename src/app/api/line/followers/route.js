// /pages/api/followers.js

export default async function handler(req, res) {
    try {
      const response = await fetch('https://api.line.me/v2/bot/followers/ids?limit=1000', {
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
  