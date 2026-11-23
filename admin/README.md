# Senada Desk — Admin Dashboard Preview

Dashboard prototype untuk menguji alur pengelolaan inquiry Senada Creatlabs.

## Buka preview
Jika GitHub Pages aktif dari branch \`main\` folder \`/(root)\`, dashboard dapat dibuka di:

\`https://bernadusbayu148-source.github.io/senada-creatlabs/admin/\`

## Fitur prototype
- Overview dengan ringkasan inquiry dan pipeline.
- Inbox dengan daftar percakapan, pencarian, filter belum dibaca, dan panel detail prospek.
- Simulasi balasan di dalam dashboard.
- Perubahan status prospek.
- Daftar kontak dan tampilan pipeline proyek.
- Tema gelap dan terang.
- Data contoh tersimpan di localStorage browser.

## Batasan penting
- Semua nama, pesan, email, nomor, dan nilai proyek di dashboard ini adalah data fiktif untuk preview.
- Form website belum mengirim data ke dashboard.
- Balasan tidak dikirim ke WhatsApp dan tidak tersimpan ke database server.
- Belum ada autentikasi/login. Jangan gunakan halaman ini untuk data klien sungguhan.
- Dashboard sengaja dipisahkan dari website publik di folder \`admin/\` dan tidak mengubah \`index.html\`.

## Tahap integrasi berikutnya
1. Backend PHP + MySQL untuk menyimpan inquiry dan percakapan.
2. Endpoint form untuk mengirim brief website ke database.
3. Login admin dan pembatasan akses.
4. WhatsApp Cloud API, webhook pesan masuk, dan pengiriman pesan keluar.
5. Persetujuan/opt-in kontak dan template pesan awal sesuai aturan WhatsApp.
