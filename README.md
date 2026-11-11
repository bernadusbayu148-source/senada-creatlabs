# Senada Creatlabs — Website Prototype

## Buka secara lokal
Klik dua kali `index.html` pada browser.

## Upload ke hosting
Upload `index.html` dan `favicon.svg` ke folder publik hosting (contoh umum `public_html`) atau folder domain yang diarahkan. Pastikan keduanya dalam folder yang sama.

## Fitur
- Responsive layout, mobile navigation, anchor navigation.
- FAQ expandable, paket yang membantu mengisi brief, generator brief + tombol salin.
- Favicon SVG dan style logo teks/ikon.
- Metadata dasar untuk SEO, tanpa tracking.

## Belum dihubungkan
- Tidak ada domain, email, WhatsApp, media sosial atau payment yang di-hardcode.
- Form saat ini **hanya menyalin teks**, bukan mengirim leads ke admin atau database.
- Kartu proyek bertanda DEMO, tidak mengklaim sebagai pekerjaan klien.

## Setelah identitas dan kontak final
- Pasang tautan WhatsApp/akun bisnis atau integrasikan form ke backend (PHP/API).
- Tambah privacy policy jika mengumpulkan dan menyimpan data pengunjung.
- Ganti demo dengan portofolio yang diperbolehkan dipublikasikan.
- Atur domain, SEO, dan email bisnis.

## Publikasi ke GitHub Pages
1. Buka **Settings → Pages** pada repositori GitHub.
2. Pada **Build and deployment**, pilih **Deploy from a branch**.
3. Pilih branch **main**, folder **/(root)**, lalu klik **Save**.
4. Setelah deployment selesai, buka https://bernadusbayu148-source.github.io/senada-creatlabs/.

Situs ini statis (HTML, CSS, JavaScript), sehingga bisa diterbitkan di GitHub Pages tanpa server PHP atau database. Kontak dan formulir masih bersifat prototipe.

## Navigasi mobile & preview konsep
- Pada layar kecil, menu utama menjadi dock ikon transparan yang mengambang di bawah layar (Beranda, Layanan, Konsep, Paket, Kontak). Navigasi desktop tetap menggunakan menu biasa.
- Konsep dan Paket dapat digeser ke samping menggunakan sentuhan, tombol panah, atau tombol keyboard panah saat carousel terfokus.
- Dua konsep demo dapat dibuka langsung dengan mengetuk kartu di bagian **Konsep**:
  - [Kedai kopi hangat](demos/kopi-hangat.html)
  - [Brand lifestyle bloom.](demos/bloom.html)
- Kedua website demo bersifat fiktif, bukan portofolio proyek klien. Keduanya memiliki navigasi dan filter konten untuk menunjukkan interaksi contoh.
- Tampilan tambahan diatur pada `mobile-experience.css`. Perubahan halaman tetap bersumber dari `index.html`.

## Mode terang / gelap dan pilihan bahasa ID / EN
- Header website utama dan kedua demo menyediakan tombol bulan/matahari untuk mengganti tema serta pilihan **ID / EN** untuk bahasa.
- Pilihan tersimpan pada `localStorage` browser (`senada-theme`, `senada-language`) dan konsisten saat membuka demo konsep; pengguna tetap dapat menggantinya kapan saja.
- `preferences.css` mengelola warna tema dan tata letak kontrol. `preferences.js` mengelola interaksi dan teks bilingual di seluruh halaman.
- Pesan brief yang disalin mengikuti bahasa saat tombol ditekan. Data tidak dikirim ke server.
- Jika JavaScript atau penyimpanan browser tidak tersedia, konten awal tetap berbahasa Indonesia dan tema bawaan terang.
