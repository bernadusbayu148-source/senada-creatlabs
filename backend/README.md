# Senada Private Preview Backend

Backend ini disiapkan untuk autentikasi admin, pengelolaan project preview, password per proyek, dan pintu akses preview statis. Tidak ada koneksi hosting yang dilakukan dari proses pengembangan ini.

## Arsitektur

Gunakan dua subdomain terpisah:

- Admin — document root diarahkan ke backend/admin-public/.
- Preview — document root diarahkan ke backend/preview-public/.
- Aplikasi PHP dan konfigurasi — berada di backend/app/ dan backend/config.php, di luar document root.
- Hasil website preview — berada di direktori preview_storage_path, di luar document root dan tidak dapat diakses sebagai file statis.

Pemisahan host admin dan preview penting: kode JavaScript milik website pelanggan tidak boleh berjalan pada origin yang sama dengan API admin.

## Fitur backend yang disiapkan

- Login admin tanpa registrasi publik; akun pertama dibuat dari CLI.
- Password admin dan password preview disimpan dengan password_hash() dan diverifikasi dengan password_verify().
- Session cookie HttpOnly, SameSite=Lax, dan Secure ketika HTTPS aktif.
- Batas idle session 30 menit dan batas absolut 8 jam.
- CSRF token untuk perubahan data.
- Pembatasan percobaan login admin dan password preview: 10 kegagalan per 15 menit per identitas/IP.
- Pengelolaan project: repository, branch, slug, kategori, mode deployment, aktif/nonaktif.
- Password unik per project; password minimal 12 karakter dan tidak pernah dikirim kembali ke dashboard.
- Preview statis dilayani melalui PHP setelah password benar; direktori hasil deploy tidak diekspos langsung.
- Endpoint manual deployment memicu GitHub Actions workflow_dispatch apabila token server sudah dikonfigurasi.
- Template workflow menyediakan push deployment otomatis dan workflow dispatch manual.

## Batasan saat ini

- Belum dihubungkan ke hosting, domain, database, GitHub token, atau repository klien.
- Belum ada file konfigurasi config.php berisi credential. config.example.php hanya contoh.
- Integrasi deploy memerlukan workflow disalin ke repository proyek dan secret FTPS diatur pada repository tersebut.
- Preview saat ini untuk website statis (HTML/CSS/JS atau hasil build frontend). Aplikasi PHP yang membutuhkan runtime/database sendiri perlu lingkungan deployment terpisah.
- URL preview memakai prefix /p/{slug}/. Website sebaiknya menggunakan asset path relatif atau mengatur base path /p/{slug}/. Asset root-absolut seperti /assets perlu disesuaikan saat build.
- Dashboard Inbox, Kontak, Proyek dan balasannya masih prototype browser-local; backend ini belum mengubahnya menjadi CRM server-side.

## File utama

- database/schema.sql — tabel database.
- config.example.php — contoh konfigurasi; salin menjadi config.php di luar document root.
- app/bootstrap.php — koneksi PDO, session, CSRF, helper.
- admin-public/api.php — endpoint autentikasi dan pengelolaan preview.
- admin-public/admin-gate.php — halaman login dan server-side gate dashboard.
- admin-public/auth.js — session check dan logout.
- preview-public/preview.php — autentikasi pelanggan dan file delivery.
- scripts/create-admin.php — pembuatan akun owner via CLI.
- templates/senada-preview-deploy.yml — template GitHub Actions.

## Persiapan nanti (belum dijalankan)

1. Siapkan subdomain admin dan preview, keduanya memakai HTTPS.
2. Buat database MySQL khusus Senada, lalu import database/schema.sql.
3. Letakkan backend/app/ dan backend/config.php di luar document root.
4. Arahkan document root subdomain admin ke backend/admin-public/; salin folder admin/ dashboard ke dalam folder tersebut dan salin favicon.svg ke root document root admin.
5. Arahkan document root subdomain preview ke backend/preview-public/.
6. Buat folder hasil deploy di luar kedua document root, lalu isi preview_storage_path.
7. Salin config.example.php menjadi config.php, isi credential database, app secret, storage path, dan URL preview. Batasi permission file konfigurasi.
8. Setelah schema sudah di-import, jalankan php backend/scripts/create-admin.php email-admin@domain.com dari terminal hosting.
9. Untuk setiap repository proyek, salin template workflow ke .github/workflows/senada-preview-deploy.yml, ganti placeholder slug dan konfigurasi FTPS secrets:
   - SENADA_FTP_SERVER
   - SENADA_FTP_USERNAME
   - SENADA_FTP_PASSWORD
   - SENADA_PREVIEW_REMOTE_DIR (folder khusus slug tersebut di storage privat)
   - repository variable SENADA_PREVIEW_BRANCH
10. Buat GitHub fine-grained token server-side dengan izin Actions: write dan Contents: read untuk repository proyek. Simpan hanya di config.php.
11. Uji dengan project dummy dan password sementara sebelum mengirim link ke pelanggan.

Jangan arahkan domain produksi ke backend sebelum kemampuan hosting (PHP 8.1+, PDO MySQL, cURL, FTPS, Apache 2.4 dengan mod_rewrite/.htaccess, subdomain, HTTPS, dan document-root terpisah) diverifikasi dan semua checklist keamanan lulus.
