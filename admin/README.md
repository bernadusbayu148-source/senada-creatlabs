# Senada Desk — Admin Dashboard

Dashboard prototype untuk menguji alur pengelolaan inquiry Senada Creatlabs.

## Buka demo publik

Jika GitHub Pages aktif dari branch main folder root, dashboard demo dapat dibuka di:

https://bernadusbayu148-source.github.io/senada-creatlabs/admin/

## Fitur UI

- Satu navigasi terpadu untuk Overview, Inbox, Kontak, Proyek, Project Preview, dan AI Workspace.
- Customer Reply Assistant di dalam Inbox: menganalisis pesan pelanggan, memisahkan catatan internal dari jawaban pelanggan, memilih bagian draft, mengeditnya, lalu memasukkannya ke kolom balasan. AI tidak mengirim pesan otomatis.
- Agent Coding Mode di AI Workspace dengan konteks proyek, tahapan agent, contoh diff, dan simulasi review persetujuan owner.
- Overview dengan ringkasan inquiry dan pipeline.
- Inbox dengan daftar percakapan, pencarian, filter belum dibaca, dan panel detail prospek.
- Simulasi balasan dan perubahan status prospek.
- Bantuan balasan AI dan Agent Coding masih berupa simulasi lokal; OpenAI API dan GitHub App belum terhubung.
- Daftar kontak dan tampilan pipeline proyek.
- Tema gelap dan terang.
- Project Preview dengan konfigurasi repository, branch, slug, metode deployment, dan kolom password pada mode server.

## Status penyimpanan dan keamanan

- URL GitHub Pages di atas tetap merupakan demo publik. Halaman itu tidak menjalankan PHP, tidak memiliki login server-side, dan data inbox tetap tersimpan di localStorage.
- Jangan masukkan password proyek, token GitHub, credential hosting, atau data klien rahasia pada demo publik.
- Backend PHP/MySQL telah disiapkan di folder backend/, tetapi belum dipasang ke hosting atau database.
- Pada hosting nanti, dashboard harus dibuka melalui admin-gate.php pada subdomain admin terpisah. API memerlukan sesi admin, CSRF, dan pembatasan percobaan login.
- Password preview disimpan sebagai hash di database. Nilai password asli tidak dapat dibaca kembali dari dashboard.
- Hasil preview disimpan di luar document root dan hanya disajikan setelah autentikasi di subdomain preview terpisah.

## Backend

Lihat backend/README.md untuk arsitektur, skema database, endpoint API, autentikasi pelanggan, serta template GitHub Actions untuk deployment manual dan otomatis.

## Batasan yang belum selesai

- Backend belum terhubung ke hosting, domain, database, atau token GitHub.
- Inbox, Kontak, Proyek, dan riwayat balasan belum dipindahkan ke database server.
- WhatsApp Cloud API dan webhook belum dihubungkan.
- Customer Reply Assistant belum memakai model AI; aturan lokal hanya mendemonstrasikan alur analisis, pemilihan bagian jawaban, dan penyusunan draft.
- Agent Coding di AI Workspace belum membaca repository, membuat perubahan, commit, atau pull request.
- Preview mendukung website statis / hasil build frontend. Aplikasi PHP dengan runtime dan database sendiri memerlukan lingkungan deployment terpisah.

Jangan gunakan dashboard publik GitHub Pages untuk mengelola pelanggan sungguhan.