// api/edit-design.js
// Edita un diseño de Canva con los datos del jugador

const ELEMENTS = {
  nombre:      'PBCF1v0R0xqJ4H5g-LBFG8RMXcjJZhWV1-LBZ869Cg4TrHn24Z',
  puesto:      'PBCF1v0R0xqJ4H5g-LBFG8RMXcjJZhWV1-LBRJ7RLxphwNC4cR',
  numero:      'PBCF1v0R0xqJ4H5g-LByPGZKgWg2RYdq7',
  caract_list: 'PBCF1v0R0xqJ4H5g-LBCX27ymrBcj6Y4K-LBsc6YnHWY6P1LTD',
  stats_vals:  'PBCF1v0R0xqJ4H5g-LBtclc3CXGhzzBCL-LBkKj9gtCQqVwW5G',
  foto:        'PBCF1v0R0xqJ4H5g-LBknfhYbBX4vHccz',
};

async function canvaRequest(path, method, body, token) {
  const res = await fetch(`https://api.canva.com/rest/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Canva API error ${res.status}`);
  return data;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { designId, player, assetId, canvaToken } = req.body;

  if (!designId || !player || !canvaToken) {
    return res.status(400).json({ error: 'Faltan parámetros: designId, player, canvaToken' });
  }

  try {
    // 1. Start editing transaction
    const txData = await canvaRequest(`/designs/${designId}/editing_sessions`, 'POST', {}, canvaToken);
    const transactionId = txData.editing_session?.id || txData.transaction_id;
    if (!transactionId) throw new Error('No se obtuvo transaction_id');

    // 2. Build operations
    const caract = player.caracteristicas?.length
      ? player.caracteristicas.map(c => `• ${c}`).join('\n')
      : '• -';
    const statsStr = `PPP: ${player.pts}     |     3PTS: ${player.tres}     |     TL: ${player.tl}     |     RE OF: ${player.reb}     |     AS: ${player.asis}`;

    const operations = [
      { type: 'replace_text', element_id: ELEMENTS.nombre,      text: player.nombre },
      { type: 'replace_text', element_id: ELEMENTS.puesto,      text: player.puesto },
      { type: 'replace_text', element_id: ELEMENTS.numero,      text: `#${player.numero}` },
      { type: 'replace_text', element_id: ELEMENTS.caract_list, text: caract },
      { type: 'replace_text', element_id: ELEMENTS.stats_vals,  text: statsStr },
    ];

    if (assetId) {
      operations.push({
        type: 'update_fill',
        element_id: ELEMENTS.foto,
        asset_type: 'image',
        asset_id: assetId,
        alt_text: player.nombre,
      });
    }

    // 3. Perform operations
    await canvaRequest(
      `/designs/${designId}/editing_sessions/${transactionId}/commands`,
      'POST',
      { commands: operations },
      canvaToken
    );

    // 4. Commit
    await canvaRequest(
      `/designs/${designId}/editing_sessions/${transactionId}/publish`,
      'POST',
      {},
      canvaToken
    );

    return res.status(200).json({
      success: true,
      designId,
      editUrl: `https://www.canva.com/design/${designId}/edit`,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
