import crypto from 'crypto';

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // або 'https://bnpfoodagro.pl'
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { event_name, event_id, user_data } = req.body;

  if (!event_name || !user_data?.email || !user_data?.phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Перевіряємо наявність access token
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || 'EAAoE0agTPecBPMctYn9yAJPJ6R1hQXJZCIlhx8LcOzRSW56vj2FeZCCj5NJHuxdJpuK4eNhfZAkcD86cH3eQfaBXXKdXzOZAAZBQuyozW7Gcl7iLTxHnVSzujiZBYVtxsTYjmphEcZBNH9XE1W0npGO2YZAgg1R1YaMGTrFrWwAgOsESZA3JhxO39nJZCl6GIYnmEx7gZDZD'
  const pixelId = process.env.FACEBOOK_PIXEL_ID || '1321174279619179';
  
  if (!accessToken) {
    return res.status(500).json({ error: 'Facebook access token not configured' });
  }

  const payload = {
    event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: event_id || `evt_${Date.now()}`,
    action_source: "website",
    user_data: {
      em: hash(user_data.email),
      ph: hash(user_data.phone),
      fbp: user_data.fbp,
      fbc: user_data.fbc,
      client_user_agent: req.headers['user-agent'],
      client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    }
  };

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [payload] })
    }
  );

  const result = await response.json();
  res.status(response.status).json(result);
}

function hash(input) {
  return crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex');
}