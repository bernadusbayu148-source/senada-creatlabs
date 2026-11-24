# Private Project Preview — Senada Creatlabs

## Tujuan

Menyediakan satu URL preview per project yang hanya dapat dibuka oleh orang yang diberi password khusus untuk project tersebut. Source code tetap berada di repository GitHub.

## Status sekarang

**Backend dan UI sudah disiapkan di repository. Hosting, database, dan domain belum dihubungkan.**

Yang sudah ada:
- Admin UI dengan kolom password khusus project (hanya tampil pada mode server).
- PHP API untuk login admin, session, CSRF, daftar/simpan/nonaktifkan project, pemicu deployment manual, dan sinkronisasi status workflow GitHub Actions.
- Database schema untuk akun admin, project preview, percobaan login, dan deployment.
- Password admin dan password pelanggan disimpan dengan password_hash(), bukan teks asli.
- Pintu preview PHP untuk memeriksa password dan menayangkan file statis dari storage privat.
- Template GitHub Actions untuk deployment otomatis saat push pada branch pilihan dan deployment manual.
- Workflow pemeriksaan sintaks PHP dan JavaScript.

Yang belum aktif:
- Tidak ada database yang dibuat atau diisi.
- Tidak ada config.php, password admin, password pelanggan, token GitHub, atau credential hosting di repository.
- Tidak ada subdomain yang diarahkan dan tidak ada file yang diunggah ke hosting.
- GitHub Pages dan URL dashboard demo tetap publik. Tombol penarikan versi dan konfigurasi proyek pada halaman publik merupakan simulasi browser, bukan deployment sungguhan. Jangan memasukkan data rahasia di sana.

## Arsitektur yang diwajibkan

Gunakan dua origin terpisah:

1. **Admin subdomain** — document root diarahkan ke backend/admin-public/. Dashboard HTML, CSS, dan JS disalin ke folder admin/ di document root tersebut. URL dashboard melewati admin-gate.php.
2. **Preview subdomain** — document root diarahkan ke backend/preview-public/. Hanya host ini yang menayangkan project preview dan form password pelanggan.
3. **PHP app/config** — backend/app/ dan backend/config.php ditempatkan di luar document root.
4. **Private storage** — direktori hasil deploy berada di luar document root kedua subdomain. File tidak dapat diakses langsung melalui URL statis.
5. **Database** — database MySQL baru khusus Senada. Jangan memakai database PA.YU.

Pemisahan origin preview dan admin mencegah JavaScript dari website pelanggan berjalan pada origin yang sama dengan API admin.

## Keamanan

- Admin: session cookie HttpOnly, SameSite, Secure saat HTTPS, idle timeout 30 menit, batas absolut 8 jam.
- Mutasi data: CSRF token.
- Password: password_hash()/password_verify(), minimal 12 karakter untuk password preview dan 14 karakter untuk owner admin.
- Brute force: 10 kegagalan dalam 15 menit per identitas/IP memicu pembatasan sementara.
- Project: slug unik; slug tidak dapat diubah setelah dibuat.
- Akses pelanggan: sesi preview khusus per project; idle 30 menit dan batas absolut 8 jam.
- Akses dicabut: project nonaktif langsung menolak akses preview.
- File delivery: PHP membatasi path traversal, symlink keluar dari folder project, file dotfile, dan file server-side seperti PHP/SQL/ENV.
- Token GitHub hanya berada pada config.php server. FTP/FTPS credentials hanya berada pada GitHub repository secrets.
- HTTPS wajib diaktifkan sebelum dipakai pelanggan.

## Deployment manual dan otomatis

Template ada di backend/templates/senada-preview-deploy.yml.

Untuk tiap repository proyek:
- Salin template ke .github/workflows/senada-preview-deploy.yml.
- Ganti placeholder __SLUG__ dengan slug yang sudah terdaftar di Senada.
- Tambahkan repository secrets SENADA_FTP_SERVER, SENADA_FTP_USERNAME, SENADA_FTP_PASSWORD, dan SENADA_PREVIEW_REMOTE_DIR.
- Tambahkan repository variable SENADA_PREVIEW_BRANCH.
- Pastikan remote directory mengarah ke folder project yang tepat di private storage, bukan ke public_html.

Otomatis:
- Workflow menerima event push.
- Job hanya berjalan bila nama branch sama dengan SENADA_PREVIEW_BRANCH.

Manual:
- Owner memilih **Tarik versi terbaru dari GitHub** pada project.
- Backend memanggil GitHub Actions workflow_dispatch pada branch project yang tersimpan.
- Tombol **Periksa status** meminta daftar run workflow GitHub dan menyinkronkan status serta commit ke riwayat deployment.
- Server memerlukan fine-grained GitHub token dengan Actions: write, Actions: read, dan Contents: read untuk repository yang diizinkan.

## Batasan jenis project

Saat ini preview dirancang untuk website statis: HTML, CSS, JavaScript, atau hasil build frontend. File PHP tidak dieksekusi dan tidak disajikan sebagai source. Aplikasi yang memerlukan backend PHP, database, worker, atau runtime khusus perlu deployment terisolasi tersendiri.

URL pelanggan memakai domain Senada dari nilai preview_base_url di config.php, lalu path /p/{slug}/. Contoh formatnya: https://preview.domain-senada-anda.com/p/kopi-sore/. Domain ini terpisah dari GitHub; repository hanya dipakai di sisi internal. Website sebaiknya menggunakan asset path relatif atau build base path /p/{slug}/. Asset root-absolut seperti /assets perlu disesuaikan.

## Langkah sebelum hosting dihubungkan

1. Verifikasi paket hosting: PHP 8.2+, PDO MySQL, ekstensi cURL, Apache 2.4 dengan mod_rewrite/.htaccess, HTTPS, FTPS, subdomain, dan kemampuan mengarahkan document root secara terpisah.
2. Siapkan dua subdomain admin dan preview.
3. Buat database MySQL baru untuk Senada dan import backend/database/schema.sql.
4. Salin backend/config.example.php menjadi backend/config.php di luar document root. Isi DB, app_secret, storage path, dan preview_base_url. Jangan commit file config.php.
5. Tempatkan backend/app di luar document root.
6. Jika host mengizinkan document root di luar public_html, arahkan subdomain admin langsung ke backend/admin-public. Jika tidak, salin isi folder tersebut ke document root admin dan aktifkan SetEnv SENADA_APP_BOOTSTRAP pada .htaccess dengan path absolut menuju app/bootstrap.php di luar web root. Salin folder admin/ dashboard dan favicon.svg ke document root admin.
7. Arahkan document root preview ke backend/preview-public. Jika perlu menyalin folder publik ke public_html, aktifkan SetEnv SENADA_APP_BOOTSTRAP pada .htaccess preview dengan path absolut yang sama.
8. Siapkan private storage di luar document root.
9. Jalankan backend/scripts/create-admin.php melalui CLI untuk membuat owner.
10. Konfigurasikan secrets dan variable GitHub Actions pada repository project.
11. Uji dengan project dummy dan password sementara; pastikan file tidak dapat dibuka tanpa password dan akses dapat dicabut.

Tidak ada langkah di atas yang dijalankan selama tahap pengembangan ini.