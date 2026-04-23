# ⚙️ Nexus Saver Engine v1.0
### **Standalone Serverless API for Social Media Scraping**

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/RapidAPI-0055FF?style=for-the-badge&logo=rapidapi&logoColor=white" />
</p>

**Nexus Saver Engine** adalah backend serverless yang bertindak sebagai "Pabrik Link" untuk mengolah URL dari berbagai platform media sosial (TikTok, Instagram, Facebook, YouTube) menjadi link unduhan langsung tanpa watermark.

---

## 🚀 Fitur Engine

- 🔄 **Smart API Key Rotation:** Sistem cerdas yang secara otomatis beralih ke kunci cadangan (failover) jika limit harian tercapai (High Availability).
- 🛡️ **CORS Optimized:** Dikonfigurasi secara khusus untuk menerima request dari berbagai frontend dengan aman.
- ⚡ **Zero Cold-Start:** Berjalan di infrastruktur Vercel Edge Functions untuk respon secepat kilat.
- 📡 **Multi-Platform Support:** Mendukung full-scraping dari TikTok (No Watermark), IG (Reels/Story), FB (HD/SD), dan Twitter.

---

## 🏗️ Technical Specification

- **Runtime:** Node.js 20.x
- **Infrastructure:** Vercel Serverless Functions
- **Format:** x-www-form-urlencoded Proxy
- **Output:** Structured JSON Response

---

## 🛠️ Installation & Deployment

1. Clone repository ini.
2. Edit file `api/download.js`.
3. Masukkan daftar API Keys Anda ke dalam array `API_KEYS`.
4. Deploy langsung menggunakan Vercel CLI:
```bash
vercel --prod