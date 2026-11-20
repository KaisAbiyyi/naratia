# CLAUDE.md — Naratia v2

Naratia adalah game menulis cerita bersama yang dibuat sebagai gamifikasi besar. Proyek pribadi pemilik untuk membangun rutinitas menulis. Branch `v2` adalah rebuild dengan SvelteKit. `main` berisi versi lama Next.js dan tidak dipakai lagi.

## Baca dulu

1. `docs/workflow.md`: cara kerja WP, definisi selesai, aturan antrean. **Wajib.**
2. `docs/work-packages.md`: WP yang sedang kamu kerjakan. Kerjakan hanya scope WP itu.
3. `docs/design.md`: aturan game, satu-satunya sumber kebenaran untuk perilaku.
4. `docs/tech-plan.md`: stack, model data, alur `close_round`, deteksi membaca.
5. `prototype/naratia-alur.html`: wujud dan gaya (Stabilo) yang harus diikuti UI.

`docs/archive/` berisi dokumen versi lama. Jangan dijadikan rujukan.

## Prioritas utama (wajib untuk agent yang claim WP dan untuk reviewer)

Empat hal ini adalah **prioritas tertinggi**, di atas kecepatan menyelesaikan WP. WP yang gagal di salah satunya tidak boleh masuk Siap dicek.

1. **Performa:**
   - Halaman cerita di-render server (SSR).
   - Tidak ada query N+1. Setiap pola query punya index.
   - Narasi dimuat per bab, tidak sekaligus.
   - Patuhi anggaran di `docs/workflow.md` (JS per rute, LCP di HP).
2. **Kompleksitas algoritma yang efisien:**
   - Operasi berbasis himpunan di SQL, bukan loop per baris di aplikasi.
   - Tidak ada hitungan ulang yang tumbuh dengan riwayat. Contoh: saldo dan batas harian tidak dihitung dengan `SUM`/`COUNT` atas seluruh ledger di jalur panas.
   - Tulis kompleksitas jalur penting di deskripsi PR.
3. **Keamanan:**
   - RLS di semua tabel, dan dites.
   - Semua tulis lewat fungsi `security definer` yang memeriksa `auth.uid()` dan aturan game.
   - Validasi input di server.
   - Tidak ada `{@html}` untuk teks pengguna, dan tidak ada rahasia di klien.
   - Rate limit di aksi yang bisa di-spam.
   - Panel `/dev` terkunci di production.
4. **UI/UX yang bagus:**
   - Ikuti prototipe Stabilo.
   - Rancang untuk HP dulu (390 px), area sentuh ≥ 44 px.
   - Kontras lolos di tema terang dan gelap, fokus keyboard terlihat.
   - Ada state kosong, memuat, dan error.
   - Hormati `prefers-reduced-motion`.
   - Teks Bahasa Indonesia yang jelas.

Checklist lengkapnya ada di `.github/pull_request_template.md`. Reviewer wajib memeriksa keempatnya setiap review, bukan hanya fungsionalitas.

## Aturan kerja

- Satu WP = satu branch `wp/NN-slug` dari `v2` = satu PR ke `v2`.
- Setiap WP harus menghasilkan sesuatu yang bisa diklik di preview Vercel. Perbarui **Peta WP** (`src/lib/dev/wp-map.ts`) dengan langkah cek dan tautannya.
- Deskripsi PR wajib memuat: ringkasan, tautan preview, screenshot HP (390 px) dan desktop dalam tema terang dan gelap, checklist "Cek di aplikasi", dan hal yang sengaja belum dikerjakan.
- Aturan domain (tinta, suara, keberatan, penutupan ronde) ditulis sebagai fungsi Postgres dalam satu transaksi. Jangan diduplikasi di klien.
- Ledger tinta hanya boleh di-insert, tidak pernah di-update. Semua angka ekonomi ada di satu file konfigurasi.
- Teks UI dalam Bahasa Indonesia yang wajar. Hindari istilah sistem di layar.
- Gaya diambil dari token Stabilo. Jangan menambah library UI.
- Panel `/dev` hanya aktif kalau `PUBLIC_DEV_PANEL=1`. Jangan pernah aktif di production.
- Jangan menyentuh scope WP lain. Kalau menemukan masalah di luar scope, catat di PR.

## Perintah

> Diisi oleh WP-01 (install, dev, lint, check, test, e2e, migrasi, seed).
