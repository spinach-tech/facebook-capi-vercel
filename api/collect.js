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
    'https://graph.facebook.com/v18.0/1038872511763849/events?access_token=EAAoE0agTPecBPBXzvOBUWJ4JToEMpIf1bOSWNSBRVywOhJ8awRunC35fHNFoDmSC7Cv5aCPZC46WCjyKBPfYfav47HXSlUaqIXu5tFjt2yGfi6Deaz8z02RlVXRmU442XBijYzLG6VDsnZC4QGRZALOEnEYBMwOVRL3E8vQnhXgmUE9oaXKLbcXncspy3m0swZDZD',
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