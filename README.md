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

## Koleksi demo Senada (versi terbaru)
- **[Senada Coffee](demos/senada-coffee.html)** — website coffee shop dengan katalog pesanan, keranjang, checkout, dan QR pembayaran fiktif
- **[Senada Bloom](demos/senada-bloom.html)** — website lifestyle/beauty dengan warna ekspresif, katalog berfilter, storytelling, dan detail brand
- **[Senada Prime](demos/senada-prime.html)** — contoh company profile formal dengan profil perusahaan, layanan B2B, studi kasus ilustratif, filter kategori, alur kerja, dan ajakan konsultasi

Ketiganya adalah **brand dan konten demo fiktif**, bukan klien asli atau testimoni. Tautan demo lama tetap diarahkan ke versi baru.

### Ikon dan running text
- `senada-spark.svg` adalah ikon dekoratif delapan arah baru, digunakan pada label, CTA, dan pemisah running text
- `portfolio-refresh.css` mengatur tata letak tiga kartu konsep dan animasi teks berjalan
- Running text terdiri atas **dua rangkaian identik tanpa jarak track**, dengan masing-masing rangkaian memiliki lebar minimum satu viewport untuk mencegah jeda kosong dan loncatan saat perulangan
- File `preferences.js` dilengkapi terjemahan baru agar ID/EN tetap bekerja pada konsep tambahan

### Pembaruan Senada Coffee: demo online ordering
[Senada Coffee](demos/senada-coffee.html) kini bukan landing page coffee shop biasa, melainkan **simulasi website pemesanan menu** dengan visual clean warna putih, hijau teal, dan mint (berbeda dari desain studio Senada).

- Katalog delapan contoh produk dengan kategori Coffee, Non-Coffee, Snacks dan pencarian
- Keranjang dengan tambah/kurangi jumlah, hapus item, subtotal, dan total otomatis
- Checkout simulasi untuk nama pemesan dan catatan barista
- QR **ilustratif NON-SCANNABLE** dengan watermark **DEMO / NOT PAYABLE** dan tombol simulasi pembayaran
- Status penyelesaian pesanan simulasi; tidak ada backend, pembayaran, pesanan sungguhan, atau transaksi uang
- Dukungan mobile, tema terang/gelap, serta pilihan ID/EN dengan pengaturan tersimpan di browser
- Kode terpisah: `demos/senada-coffee.html`, `demos/senada-coffee.css`, `demos/senada-coffee.js`

**Penting:** Semua nama, harga, menu, dan identitas bisnis dalam demo adalah fiktif. Jangan menggunakan QR sebagai instruksi pembayaran.

## Portofolio proyek nyata
Halaman `index.html#work` membagi portofolio menjadi **Proyek Nyata** dan **Eksplorasi & Demo**, agar karya yang sudah dipublikasikan tidak disamakan dengan konsep fiktif.

### Proyek nyata (tautan eksternal)
- [Kopi Feeling](https://www.kopifeeling.com/) — website brand kopi gerobak, pilihan layanan dan informasi lokasi
- [Rumah Kopi Manupi](https://kopimanupi.com/) — website kedai kopi, menu, lokasi, galeri dan papan poin pelanggan
- [PA.YU Coffee](https://payucoffee.com/) — website coffee shop, membership dan poin loyalitas

Kartu proyek memakai ilustrasi visual CSS, bukan tangkapan layar situs. Setiap tautan membuka domain aslinya dalam tab baru. Bagian ini menggunakan `real-projects.css` dan mendukung scroll horizontal di mobile, mode gelap, serta bahasa ID/EN.

### Thumbnail homepage otomatis untuk proyek nyata
Pada kartu **Proyek Nyata**, `real-project-screenshots.js` sekarang mencoba memuat tangkapan layar homepage dari URL domain asli melalui layanan screenshot publik (WordPress mShots, lalu thum.io sebagai cadangan). Gambar dipotong pada bagian atas agar sesuai dengan kartu desktop dan mobile. Bila kedua layanan gagal atau mengembalikan gambar terlalu kecil, ilustrasi sebelumnya tetap ditampilkan.

Thumbnail ini **bergantung pada layanan eksternal** dan tidak disimpan sebagai screenshot statis di repositori. Isi yang ditampilkan dapat berubah mengikuti kondisi situs dan cache layanan screenshot. Untuk hasil final yang benar-benar tetap dan terverifikasi, tambahkan berkas gambar hasil capture ke repositori dan ganti thumbnail dinamis dengan gambar lokal.

## Dua demo interaktif baru: clothing & travel agent

### [Senada Supply — Clothing E-commerce](demos/senada-supply.html)
- Desain editorial clothing dengan palet netral-hijau, berbeda dari identitas visual studio Senada Creatlabs
- Delapan produk fiktif, kategori, pencarian, urutan harga, pilihan ukuran/warna, tampilan detail produk
- Wishlist dan keranjang yang disimpan di browser `localStorage`
- Checkout simulasi mencakup nama, email, alamat, opsi pengiriman/ambil di toko, promo contoh `PLAY10`, serta ringkasan biaya
- Semua transaksi **fiktif**, tidak ada sistem pembayaran, API toko, stok real-time, atau pengiriman sungguhan
- File: `demos/senada-supply.html`, `demos/senada-supply.css`, `demos/senada-supply.js`

### [Senada Journey — Travel Agent](demos/senada-journey.html)
- Desain bertema pesisir tropis dengan palet teal-biru, bukan tema utama Senada
- Enam contoh paket perjalanan domestik, pencarian destinasi/tanggal/peserta, filter kategori dan urutan harga/durasi
- Halaman detail paket beserta itinerary per hari dan contoh fasilitas
- Form booking simulasi dengan tanggal, peserta dewasa/anak, nama, email, dan telepon
- Kalkulator biaya contoh (anak dihitung 70% harga dewasa) dan ringkasan booking yang bisa disalin
- Semua harga, destinasi paket, agenda, jadwal dan nomor booking **ilustratif**. Tidak ada inventori, reservasi, tiket, atau pembayaran yang benar-benar diproses
- File: `demos/senada-journey.html`, `demos/senada-journey.css`, `demos/senada-journey.js`

Kedua demo responsif, punya mode terang/gelap dan pilihan bahasa ID/EN yang mengikuti preferensi website utama. Halaman `index.html#work` sekarang memuat **lima** demo; kartu baru ditata lewat `demo-expansion.css`.
