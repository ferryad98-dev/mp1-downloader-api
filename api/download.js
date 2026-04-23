/**
 * MP1 Downloader Backend API
 * Serverless API - All Social Media Downloader
 */

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query || req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // API Key kamu (ganti kalau mau tambah key cadangan)
  const API_KEYS = [
    '6f304c24d4mshedbc4e7e0e60bd7p1b4729jsn92bec3252946'
  ];

  for (let i = 0; i < API_KEYS.length; i++) {
    const key = API_KEYS[i];

    try {
      const formData = new URLSearchParams();
      formData.append('url', url);

      const response = await fetch('https://snap-video3.p.rapidapi.com/download', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': key,
          'x-rapidapi-host': 'snap-video3.p.rapidapi.com',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (response.status === 429 || response.status === 403) {
        continue; // coba key berikutnya
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return res.status(200).json(data);

    } catch (error) {
      if (i === API_KEYS.length - 1) {
        return res.status(500).json({ error: 'Gagal memproses URL. Coba lagi nanti.' });
      }
    }
  }
}