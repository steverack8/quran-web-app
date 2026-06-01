# Al-Quran Web

Al-Quran Web adalah aplikasi digital interaktif untuk membaca Al-Quran yang menyediakan teks Arab, terjemahan Bahasa Indonesia, serta audio murottal yang dapat diputar per ayat maupun secara berlanjut antar surah. Aplikasi ini dibangun sebagai aplikasi berbasis client-side yang mengambil data secara langsung dari API Kemenag RI melalui layanan equran.id.

## Teknologi Utama
* **React JS** (Library antarmuka pengguna)
* **Tailwind CSS** (Styling utilitas modern)
* **RESTful API** (Pengambilan data asinkron langsung)

---

## Dokumentasi API & Sumber Data

Aplikasi ini sepenuhnya mengandalkan rute pengambilan data (*fetch*) langsung di sisi browser dari API publik yang disediakan oleh **equran.id**. Berikut adalah rincian API yang digunakan:

### 1. API Detail Ayat & Terjemahan Surah
Digunakan untuk mengambil teks Arab, transliterasi Latin, terjemahan Bahasa Indonesia, dan metadata surah secara dinamis berdasarkan nomor surah yang diakses.

* **Endpoint**: `GET https://equran.id/api/v2/surat/{nomor_surah}`
* **Contoh Request**: `GET https://equran.id/api/v2/surat/1` (Mengambil detail Surah Al-Fatihah)
* **Format Respons JSON**:
```json
{
  "code": 200,
  "message": "Berhasil memuat detail surah",
  "data": {
    "nomor": 1,
    "nama": "الفاتحة",
    "namaLatin": "Al-Fatihah",
    "jumlahAyat": 7,
    "tempatTurun": "Mekah",
    "arti": "Pembukaan",
    "deskripsi": "Surat Al Fatihah (Pembukaan) yang diturunkan di Mekah...",
    "audioFull": {
      "01": "https://equran.nos.wjv-1.neo.id/audio-full/Abdullah-Al-Juhany/001.mp3",
      "05": "https://equran.nos.wjv-1.neo.id/audio-full/Mishary-Rashid-Al-Afasy/001.mp3"
    },
    "ayat": [
      {
        "nomorAyat": 1,
        "teksArab": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "teksLatin": "Bismillāhir-raḥmānir-raḥīm(i).",
        "teksIndonesia": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
        "audio": {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/01/001001.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/05/001001.mp3"
        }
      }
    ],
    "suratSelanjutnya": {
      "nomor": 2,
      "nama": "البقرة",
      "namaLatin": "Al-Baqarah",
      "jumlahAyat": 286
    },
    "suratSebelumnya": false
  }
}
```

### 2. CDN Audio Murottal (Streaming Per Ayat)
Aplikasi merangkai tautan audio murottal secara dinamis untuk dimainkan di pemutar audio bawah berdasarkan qari pilihan pengguna, nomor surah, dan nomor ayat.

* **Format URL CDN**: `https://equran.nos.wjv-1.neo.id/audio-ayat/{kode_qari}/{surah_3_digit}{ayat_3_digit}.mp3`
* **Kode Qari Utama**:
  * `05`: Mishary Rashid Al-Afasy (Default)
  * `01`: Abdullah Al-Juhany
  * `02`: Abdul-Basit Abd-Us-Samad
  * `03`: Abdurrahman As-Sudais
  * `04`: Al-Minshawi
* **Contoh URL Audio**: `https://equran.nos.wjv-1.neo.id/audio-ayat/05/001001.mp3` (Audio Ayat 1 Al-Fatihah dilantunkan oleh Mishary Rashid Al-Afasy)

---

## Panduan Instalasi & Penggunaan Lokal

Untuk memasang dan menjalankan aplikasi ini secara lokal di komputer Anda, pastikan Anda telah memasang **Node.js** terlebih dahulu, kemudian ikuti langkah-langkah di bawah ini:

### 1. Kloning / Unduh Proyek
Pindahkan direktori terminal Anda ke folder hasil unduhan aplikasi ini.

### 2. Pasang Dependencies
Jalankan perintah berikut di terminal Anda untuk mengunduh dan menyelaraskan seluruh berkas modul pustaka frontend yang diperlukan:
```bash
npm install
```

### 3. Jalankan Server Pengembangan Lokal
Setelah dependencies terpasang, jalankan perintah pengembangan berikut:
```bash
npm run dev
```
Setelah server menyala, buka alamat URL yang tercantum pada konsol terminal Anda di browser Anda.

### 4. Melakukan Build Produksi (Opsional)
Untuk mengompilasi dan memaketkan aplikasi menjadi file HTML/JS/CSS statis siap pakai untuk hosting produksi, jalankan perintah:
```bash
npm run build
```
Hasil kompilasi siap pakai akan tersimpan di dalam folder `dist/`.
