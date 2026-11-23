# Private Project Preview — Senada Creatlabs

## Tujuan

Menyediakan satu lingkungan preview per repository yang hanya dapat dibuka oleh orang yang diberi akses. Satu proyek dapat memiliki URL preview sendiri, sementara source code tetap berada di repository GitHub.

## Status implementasi saat ini

**Tahap 1 — UI prototype sudah ditambahkan ke Admin Dashboard.**

- Menu \`Project Preview\` dan formulir konfigurasi sudah tersedia.
- Data contoh disimpan di \`localStorage\` browser yang sedang digunakan.
- Satu konfigurasi dapat memuat repository, branch, kategori, slug, serta pilihan auto/manual deployment.
- Tombol \`Simulasikan deploy\` hanya menampilkan pemberitahuan simulasi.
- Belum ada GitHub API, GitHub Actions, hosting upload, database, login admin, atau private access enforcement.
- Jangan masukkan GitHub token, password, credential hosting, atau data proyek rahasia ke halaman ini.

## Mengapa tidak memakai GitHub Pages untuk preview privat?

GitHub Pages pada konfigurasi repository ini adalah website publik. Menyembunyikan URL, membuat slug acak, atau menyimpan link di JavaScript bukan autentikasi. Pengunjung yang mengetahui alamatnya tetap dapat membukanya.

Website utama dan demo yang sudah ada di \`demos/\` tetap mengikuti publikasi GitHub Pages yang sekarang. Penambahan menu ini tidak otomatis mengubah demo lama menjadi privat.

## Arsitektur yang dituju

1. **GitHub repository** — sumber kode tiap proyek.
2. **GitHub Actions** — menjalankan deployment otomatis saat push ke branch yang dipilih dan menyediakan pemicu manual (\`workflow_dispatch\`).
3. **Private preview hosting** — menayangkan hasil build di subdomain/folder preview, bukan di GitHub Pages publik.
4. **Access gate** — autentikasi di depan preview. Pilihan awal yang bisa dievaluasi:
   - Cloudflare Access pada subdomain preview (mengizinkan email pelanggan yang ditentukan), atau
   - HTTP Basic Authentication / login server-side pada hosting yang mendukungnya.
5. **Admin backend** — menyimpan daftar proyek di database, memvalidasi role admin, dan meminta GitHub Actions menjalankan workflow.
6. **Secrets** — token GitHub dan credential deployment hanya disimpan sebagai GitHub Actions Secrets atau environment variable server. Tidak boleh dikirim ke browser atau disimpan dalam repository.

## Dua mode deployment

### Otomatis
- GitHub Actions berjalan ketika ada push ke branch proyek yang dipilih.
- Workflow membangun website sesuai stack proyek.
- Hasil build dikirim ke direktori preview proyek.
- URL tetap berada di balik access gate.

### Manual
- Admin menekan \`Deploy\` pada Project Preview.
- Backend memverifikasi sesi dan izin admin.
- Backend memicu GitHub Actions \`workflow_dispatch\` untuk repository/branch yang sudah terdaftar.
- Admin melihat status job dan waktu deployment terakhir.

Pada tahap prototype, tombol hanya simulasi dan belum menjalankan langkah-langkah di atas.

## Informasi yang perlu dipastikan sebelum deployment sungguhan

- Domain/subdomain yang akan dipakai untuk preview.
- Apakah hosting mendukung subdomain, PHP, HTTPS, dan autentikasi folder.
- Jalur deployment dan metode transfer yang didukung hosting (SFTP/FTP/SSH).
- Apakah akses privat akan memakai Cloudflare Access atau autentikasi hosting.
- Email admin dan mekanisme pemberian akses untuk pelanggan.
- Repository dan branch pertama yang akan dihubungkan.

## Checklist keamanan sebelum dipakai pelanggan

- [ ] Admin Dashboard memiliki login server-side dan session protection.
- [ ] Endpoint deployment memeriksa role admin dan CSRF.
- [ ] Token GitHub hanya disimpan di server/secret store.
- [ ] Preview dilindungi autentikasi sebelum konten dapat diakses.
- [ ] Setiap pelanggan hanya mendapat akses yang memang diizinkan.
- [ ] Demo menggunakan database, akun, dan data palsu.
- [ ] File \`.env\`, password, dan credential tidak berada di direktori publik.
- [ ] Penghapusan akses pelanggan dapat dilakukan setelah preview tidak diperlukan.
