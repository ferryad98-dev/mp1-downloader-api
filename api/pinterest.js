export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query || req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(`https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '6f304c24d4mshedbc4e7e0e60bd7p1b4729jsn92bec3252946',
        'x-rapidapi-host': 'pinterest-video-and-image-downloader.p.rapidapi.com'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        success: true,
        provider: "pinterest",
        title: data.title || data.data?.title || "Pinterest Video",
        thumbnail: data.thumbnail || data.data?.thumbnail || "",
        url: data.url || data.data?.url || "",
        type: "video"
      });
    } else {
      return res.status(400).json({ error: "Gagal mengambil data Pinterest" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
