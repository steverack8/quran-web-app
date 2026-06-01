# Al-Quran Web

Al-Quran Web adalah aplikasi digital interaktif untuk membaca Al-Quran yang menyediakan teks Arab, terjemahan Bahasa Indonesia, serta audio murottal yang dapat diputar per ayat maupun secara berlanjut antar surah. Aplikasi ini dibangun sebagai aplikasi berbasis client-side yang mengambil data secara langsung dari API Kemenag RI melalui layanan equran.id.

## Teknologi Utama
* **React JS** (Library antarmuka pengguna)
* **Tailwind CSS** (Styling utilitas modern)
* **RESTful API** (Pengambilan data asinkron langsung)

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
