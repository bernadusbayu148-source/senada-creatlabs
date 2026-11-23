# Senada Preview Lab

Prototype visual **Senada Private Project Preview**. Folder ini terpisah dari website utama agar eksperimen tampilan tidak mengganggu halaman utama Senada Creatlabs.

## Buka demo

Jika GitHub Pages aktif dari branch `main` folder root:

**https://bernadusbayu148-source.github.io/senada-creatlabs/preview-lab/**

Jika Pages belum aktif, buka `index.html` secara lokal atau aktifkan melalui **Repository Settings → Pages → Deploy from a branch → main → /(root)**.

## Empat tampilan yang tersedia

1. **Admin Login** — halaman masuk visual untuk workspace Senada.
2. **Admin Dashboard** — overview, daftar project preview, status akses, dan aktivitas.
3. **Customer Password Page** — gerbang password untuk klien sebelum membuka website.
4. **Website Preview** — contoh website fiktif Aure Studio di dalam tampilan preview privat.

## Cara mencoba

- Klik **Masuk ke dashboard** pada halaman awal.
- Dari dashboard, pilih **Lihat sebagai klien** atau **Uji akses klien**.
- Gunakan password demo: `SENADA-DEMO`.
- Coba navigasi dashboard, pilihan deployment Manual / Automatic, simulasi deployment, pengaturan nama proyek, dan mode terang / gelap.

## Batasan penting

- Ini adalah prototype statis untuk melihat desain dan alur. Login admin dan password pelanggan **bukan autentikasi sungguhan**.
- Password demo ditanam di JavaScript publik dan hanya untuk simulasi. Jangan gunakan password, token, data klien, atau informasi rahasia sungguhan.
- Data proyek Aure Studio dan Bloom Atelier sepenuhnya fiktif.
- Tombol deployment hanya mengubah status simulasi. Tidak ada GitHub Actions, hosting, FTP, PHP, MySQL, atau server yang dipanggil dari halaman ini.
- Website preview contoh dibuat sebagai bagian dari halaman demo; belum membaca file hasil deployment klien.
- Backend produksi yang sudah disiapkan di folder `backend/` tetap belum dipasang ke hosting atau database.

## Struktur

- `index.html` — empat tampilan prototype.
- `styles.css` — desain responsif dan tema terang / gelap.
- `app.js` — navigasi dan interaksi simulasi.
