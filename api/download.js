/**
 * MP1 Save Backend API - Multi Provider with Fallback
 */

const PROVIDERS = [
  {
    name: "snap-video3",
    method: "POST",
    url: "https://snap-video3.p.rapidapi.com/download",
    key: "6f304c24d4mshedbc4e7e0e60bd7p1b4729jsn92bec3252946",
    host: "snap-video3.p.rapidapi.com",
    bodyType: "form"  // x-www-form-urlencoded
  },
  {
    name: "pinterest",
    method: "GET",
    url: "https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest",
    key: "6f304c24d4mshedbc4e7e0e60bd7p1b4729jsn92bec3252946",
    host: "pinterest-video-and-image-downloader.p.rapidapi.com",
    bodyType: "query"  // url parameter
  },
  // Tambah provider lain di sini nanti
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query || req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  for (let provider of PROVIDERS) {
    try {
      let fetchOptions = {
        method: provider.method,
        headers: {
          'x-rapidapi-key': provider.key,
          'x-rapidapi-host': provider.host,
        }
      };

      if (provider.method === 'POST' && provider.bodyType === "form") {
        const formData = new URLSearchParams();
        formData.append('url', url);
        fetchOptions.body = formData.toString();
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if (provider.method === 'GET') {
        const queryUrl = `${provider.url}?url=${encodeURIComponent(url)}`;
        fetchOptions.url = queryUrl;  // Untuk GET
      }

      const response = await fetch(provider.method === 'GET' ? fetchOptions.url : provider.url, fetchOptions);

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({
          ...data,
          provider: provider.name,
          success: true
        });
      }

      console.log(`Provider ${provider.name} gagal, mencoba berikutnya...`);

    } catch (error) {
      console.error(`Error ${provider.name}:`, error.message);
    }
  }

  return res.status(500).json({ 
    error: "Semua provider sedang bermasalah. Coba lagi nanti." 
  });
}
