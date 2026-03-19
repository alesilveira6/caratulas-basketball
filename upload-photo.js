// api/upload-photo.js
// Sube una foto desde URL a Canva y devuelve el asset_id

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { photoUrl, playerName, canvaToken } = req.body;

  if (!photoUrl || !playerName || !canvaToken) {
    return res.status(400).json({ error: 'Faltan parámetros: photoUrl, playerName, canvaToken' });
  }

  try {
    const response = await fetch('https://api.canva.com/rest/v1/assets/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${canvaToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playerName,
        url: photoUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.message || 'Error subiendo foto a Canva' });
    }

    const data = await response.json();
    return res.status(200).json({ asset_id: data.job?.asset?.id || data.asset?.id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
