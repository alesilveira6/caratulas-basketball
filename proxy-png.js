// api/proxy-png.js
// Descarga el PNG de Canva y lo sirve desde nuestro servidor (evita que expire el link)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Falta parámetro url' });

  try {
    const imgRes = await fetch(decodeURIComponent(url));
    if (!imgRes.ok) throw new Error('No se pudo descargar la imagen');

    const buffer = await imgRes.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Content-Disposition', 'attachment; filename="caratula.png"');
    return res.send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
