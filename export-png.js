// api/export-png.js
// Exporta un diseño de Canva como PNG y devuelve la URL de descarga

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { designId, canvaToken } = req.body;

  if (!designId || !canvaToken) {
    return res.status(400).json({ error: 'Faltan parámetros: designId, canvaToken' });
  }

  try {
    // Request export
    const exportRes = await fetch(`https://api.canva.com/rest/v1/exports`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${canvaToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        design_id: designId,
        format: { type: 'png', export_quality: 'regular' },
      }),
    });

    if (!exportRes.ok) {
      const err = await exportRes.json();
      throw new Error(err.message || `Export error ${exportRes.status}`);
    }

    const exportData = await exportRes.json();
    const jobId = exportData.job?.id;
    if (!jobId) throw new Error('No se obtuvo job ID de exportación');

    // Poll until done (max 30 seconds)
    let pngUrl = null;
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const pollRes = await fetch(`https://api.canva.com/rest/v1/exports/${jobId}`, {
        headers: { 'Authorization': `Bearer ${canvaToken}` },
      });
      const pollData = await pollRes.json();
      if (pollData.job?.status === 'success') {
        pngUrl = pollData.job?.urls?.[0];
        break;
      }
      if (pollData.job?.status === 'failed') throw new Error('Export falló');
    }

    if (!pngUrl) throw new Error('Timeout esperando el PNG');

    return res.status(200).json({ url: pngUrl });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
