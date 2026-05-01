const PROVIDERS = [
  {
    name: "snap-video3",
    method: "POST",
    url: "https://snap-video3.p.rapidapi.com/download",
    key: "6f304c24d4mshedbc4e7e0e60bd7p1b4729jsn92bec3252946",
    host: "snap-video3.p.rapidapi.com",
    bodyType: "form"
  },
  {
    name: "pinterest",
    method: "GET",
    url: "https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest",
    key: "6f304c24d4mshedbc4e7e0e60bd7p1b4729jsn92bec3252946",
    host: "pinterest-video-and-image-downloader.p.rapidapi.com",
    bodyType: "query"
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query || req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  for (let provider of PROVIDERS) {
    try {
      let fetchUrl = provider.url;
      let options = {
        method: provider.method,
        headers: {
          'x-rapidapi-key': provider.key,
          'x-rapidapi-host': provider.host,
        }
      };

      if (provider.method === 'POST') {
        const form = new URLSearchParams();
        form.append('url', url);
        options.body = form;
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        fetchUrl = `${provider.url}?url=${encodeURIComponent(url)}`;
      }

      const response = await fetch(fetchUrl, options);

      if (response.ok) {
        let raw = await response.json();

        // NORMALISASI RESPONSE
        let normalized = {
          success: true,
          provider: provider.name,
          title: raw.title || raw.data?.title || "Video Pinterest",
          thumbnail: raw.thumbnail || raw.data?.thumbnail || "",
          url: raw.url || raw.data?.url || raw.download_url || "",
          type: raw.type || raw.data?.type || "video"
        };

        return res.status(200).json(normalized);
      }
    } catch (e) {
      console.error(`Error ${provider.name}:`, e.message);
    }
  }

  return res.status(500).json({ error: "Gagal memproses link. Coba lagi." });
}
