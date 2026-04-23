export default async function handler(req, res) {
  // Kasih restu biar Frontend React lo gak baper kena drama CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Urusan birokrasi request (Preflight), lalui aja biar cepet
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;

  // Validasi: Pastikan user gak ngasih link kosong kayak janji mantan
  if (!url) {
    return res.status(400).json({ 
      error: "Mana link-nya, Senior Idin? Gak ada link, gak ada video! 😆" 
    });
  }

  /**
   * PASUKAN KUNCI RAHASIA BERGUNA UNTUK LO PENGGUNA API GRATISAN
   * Strategi 'Cadangan di atas Cadangan'. Kalau satu tumbang, 
   * yang lain siap tempur! Gak perlu bayar langganan premium! 😎💸
   */
  const API_KEYS = [
    '6f304c24d4mshedbc4e7e0e60bd7p1b4729jsn92bec3252946', // Kunci andalan 1
    'API_KEY_CADANGAN_2',                                 // Kunci serep 2
    'API_KEY_CADANGAN_3'                                  // Kunci darurat 3
  ];

  // Logic 'Smart Failover' ala gw cuy pria tampan
  for (let i = 0; i < API_KEYS.length; i++) {
    const currentKey = API_KEYS[i];
    
    try {
      // Siapkan amunisi data (Format x-www-form-urlencoded)
      const formData = new URLSearchParams();
      formData.append('url', url);

      // Saatnya beraksi! Tembak server RapidAPI pake peluru gw cuy
      const response = await fetch('https://snap-video3.p.rapidapi.com/download', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': currentKey,
          'x-rapidapi-host': 'snap-video3.p.rapidapi.com',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      // Kalau kena 'Limit Abis' (Error 429/403), gak usah panik...
      if (response.status === 429 || response.status === 403) {
        console.log(`Kunci ke-${i+1} udah capek, Senior Idin pindah ke mesin berikutnya...`);
        continue; // Gas lagi pake kunci selanjutnya di loop!
      }

      const data = await response.json();
      
      // JEBRED! Data dapet, kirim balik ke markas (React)
      return res.status(200).json(data);

    } catch (error) {
      console.error(`Error di mesin ke-${i+1}:`, error);
      
      // Kalau semua kunci udah dicoba tapi tetep zonk...
      if (i === API_KEYS.length - 1) {
        return res.status(500).json({ 
          error: "Aduh Cok! Semua mesin cadangan lagi mogok masal. Coba lagi nanti! 😅" 
        });
      }
    }
  }
}
