# Langkah Fikri Menuju Mimpi - Media Pembelajaran Interaktif (MPI)

Media Pembelajaran Interaktif (MPI) ini dikembangkan menggunakan **React JS** dan **Vite** sebagai storyboard statis yang interaktif untuk materi pembelajaran kesetaraan Paket B. Proyek ini mengusung tema **Rasa Optimis** dan menceritakan kisah inspiratif perjuangan Fikri dalam menggapai cita-citanya menjadi prajurit TNI.

---

## 🎖️ Identitas Media

* **Satuan Pendidikan:** SPNF SKB Kota Bukittinggi
* **Program:** Pendidikan Kesetaraan Paket B (Setara SMP)
* **Mata Pelajaran:** Pemberdayaan
* **Fase / Kelas:** D / VIII - IX
* **Tujuan Pembelajaran (TP):** Menanamkan Rasa Optimis dalam menghadapi kegagalan dan menyusun rencana cita-cita.
* **Judul MPI:** "Langkah Fikri Menuju Mimpi"
* **Pendidik / Penulis:** WAHYUNI, S.Pd. M.Pd, SPNF SKB KOTA BUKITTINGGI

---

## 🚀 Fitur Utama MPI

Media ini terdiri atas 19 halaman (slide) interaktif yang meliputi:
1. **Cover & Alur Tujuan Pembelajaran:** Halaman 1-2 yang memuat metadata serta 4 capaian tujuan pembelajaran siswa.
2. **Kisah Narasi Perjuangan Fikri (Halaman 3-8):**
   * **Animasi Audio & Visual:** Teks bercerita dengan ilustrasi visual orisinal bertema anime, disertai simulasi audio musik latar melankolis.
   * **Pop Pikiran Negatif (Interactive Bubble):** Siswa diajak berinteraksi mengetuk/menghilangkan pikiran buruk Fikri untuk menumbuhkan optimisme.
   * **Checklist Solusi Disiplin:** Memilih persiapan-persiapan penting sebelum Fikri memulai latihannya.
3. **Refleksi Diri & Sikap (Halaman 9-10):**
   * Form refleksi teks untuk menuliskan respon siswa atas kegagalan pribadi.
   * Papan kategorisasi sikap optimis vs pesimis (interaksi tap-to-categorize).
4. **Kuis Evaluasi Interaktif (Halaman 11-15):**
   * 5 butir soal pemahaman (pilihan ganda tunggal & pilihan ganda majemuk) dengan umpan balik visual (*feedback*) langsung setelah jawaban dikunci.
5. **3 Latihan Game Pembelajaran (Halaman 16-18):**
   * **Game 1 - Tangga Optimisme:** Menggerakkan karakter menaiki tangga dengan menjawab sikap positif.
   * **Game 2 - Kumpulkan Semangat:** Menangkap bintang-bintang sikap positif (+10) dan menghindari rintangan negatif (-5) menggunakan keranjang.
   * **Game 3 - Puzzle Kesuksesan:** Mengurutkan 5 gambar linimasa perjalanan Fikri dari kiri ke kanan secara kronologis.
6. **Halaman Rencana Sukses & Rincian Nilai (Halaman 19):**
   * Pengisian cita-cita serta 3 langkah konkret warga belajar.
   * **Rincian Jawaban Kuis:** Menampilkan evaluasi skor detail (Benar/Salah/Belum Dijawab) beserta notifikasi pengingat jika kuis belum diselesaikan.

---

## 🛠️ Panduan Setup Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

### Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 16 atau lebih baru) dan **npm** di komputer Anda. Anda bisa mengunduhnya di [nodejs.org](https://nodejs.org/).

### Langkah 1: Klon Repositori
Klon repositori ini ke komputer lokal Anda menggunakan Git:
```bash
git clone https://github.com/alfsykr/storyboard.git
cd storyboard
```

### Langkah 2: Instal Dependensi
Jalankan perintah berikut untuk menginstal semua library/dependensi React yang dibutuhkan:
```bash
npm install
```

### Langkah 3: Jalankan Server Pengembangan (Lokal)
Jalankan dev server Vite untuk melihat aplikasi berjalan secara langsung:
```bash
npm run dev
```
Setelah server berjalan, buka browser Anda dan akses tautan lokal yang tertera di terminal (biasanya **`http://localhost:5173/`**).

### Langkah 4: Bangun Proyek untuk Produksi (Build)
Jika ingin mengompilasi dan mengoptimalkan aplikasi untuk diunggah ke web hosting statis (seperti GitHub Pages, Netlify, atau Vercel), jalankan perintah:
```bash
npm run build
```
Hasil kompilasi akan berada di dalam direktori `/dist` yang siap di-deploy secara langsung.

---

## 📁 Struktur Direktori Penting

```text
storyboard/
├── public/
│   ├── images/                # File ilustrasi orisinal (cover, Fikri lulus, dsb.)
│   └── Guy Manor - Longing.mp3 # Musik latar cerita Fikri
├── src/
│   ├── assets/                # Aset gambar pembantu tambahan
│   ├── components/            # Komponen interaktif per halaman
│   │   ├── KuisInteraktif.jsx   # Komponen kuis evaluasi 5 soal
│   │   ├── KumpulkanSemangat.jsx # Game 2 - menangkap bintang positif
│   │   ├── PuzzleKesuksesan.jsx  # Game 3 - mengurutkan linimasa cerita
│   │   ├── RefleksiSikap.jsx     # Refleksi teks & drag-kategori sikap
│   │   └── TanggaOptimisme.jsx   # Game 1 - tangga nilai karakter
│   ├── App.jsx                # Layout utama, alur halaman (1-19), dan perhitungan skor
│   ├── App.css                # Desain visual global, tema warna premium, & animasi
│   ├── index.css              # Reset dasar CSS
│   └── main.jsx               # Entry point React
├── package.json               # Konfigurasi dependensi project
└── vite.config.js             # Konfigurasi bundler Vite
```

---

## 🎨 Teknologi yang Digunakan

* **Framework Inti:** React JS (Statis)
* **Bundler & Dev Server:** Vite
* **Styling:** Vanilla CSS (Desain HSL kustom dengan Dark Blue/Gold, Glassmorphism, & Animasi Micro-interactions)
* **Ikon:** Lucide React
