# CLAUDE.md — Naratia v2

Naratia adalah game menulis cerita bersama yang dibuat sebagai gamifikasi besar. Proyek pribadi pemilik untuk membangun rutinitas menulis. Branch `v2` adalah rebuild dengan SvelteKit. `main` berisi versi lama Next.js dan tidak dipakai lagi.

## Baca dulu

1. `docs/workflow.md`: cara kerja WP, definisi selesai, aturan antrean. **Wajib.**
2. `docs/work-packages.md`: WP yang sedang kamu kerjakan. Kerjakan hanya scope WP itu.
3. `docs/design.md`: aturan game, satu-satunya sumber kebenaran untuk perilaku.
4. `docs/tech-plan.md`: stack, model data, alur `close_round`, deteksi membaca.
5. `prototype/naratia-alur.html`: wujud dan gaya (Stabilo) yang harus diikuti UI.

`docs/archive/` berisi dokumen versi lama. Jangan dijadikan rujukan.

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
