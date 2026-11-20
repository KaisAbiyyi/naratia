# Naratia — Rencana Teknis

> Status: draft v0.1 (20 Nov 2026). Turunan dari `docs/design.md` v0.3 dan prototipe `prototype/naratia-alur.html`.
> Fokus sekarang: **web app**. Rencana mobile ada di §9 untuk nanti.

## 1. Keputusan framework

Syaratnya: bisa di-deploy di Vercel, dan lebih cepat dari SvelteKit secara berarti. Hasil riset (Nov 2026):

| Kandidat | Performa vs SvelteKit | Status | Keputusan |
|---|---|---|---|
| **SolidStart 2** | Sedikit lebih kecil bundle-nya (sekitar 41 kB vs 54 kB terkompresi di satu perbandingan). Runtime Solid ±1,1× vanilla, Svelte 5 ±1,2×. | Stabil sejak Sep 2026, tapi langsung masuk **mode maintenance**. Perannya dipindah ke "Start mode" di Solid 2.0 core, yang masih RC. | Tidak. Selisihnya kecil, dan ekosistemnya sedang pindah rumah. |
| **Qwik 2** | Muat awal paling ringan (resumable). | Masih **RC** (Okt 2026). Dokumentasi adapter Vercel masih memakai nama paket v1. | Tidak. Belum stabil. |
| **Nuxt (Vue Vapor)** | Vapor setara Svelte/Solid di benchmark. | Vapor opt-in per komponen dan belum jadi default. | Tidak lebih cepat secara berarti. |
| **TanStack Start, Next.js** | Bundle React jauh lebih besar (±118 kB). | Stabil. | Lebih lambat. |
| **SvelteKit (Svelte 5)** | Patokan | Stabil, adapter Vercel resmi. | **Dipakai.** |

Kesimpulan: **tidak ada kandidat yang lebih cepat secara berarti sekaligus matang, jadi pakai SvelteKit.** Naratia adalah aplikasi berbasis teks. Hambatan performa sebenarnya ada di jarak ke database dan jumlah query, bukan di framework UI.

Sumber: [benchmark Solid/Svelte/React](https://tech-insider.org/solidjs-vs-react-vs-svelte-2026/), [status SolidStart 2](https://github.com/solidjs/solid-start/discussions/2281), [mode maintenance SolidStart](https://byteiota.com/solidstart-2-0-drop-vinxi-migrate-to-vite-8-now/), [panduan Vercel untuk Solid](https://vercel.com/kb/guide/deploying-solid-with-vercel), [Qwik 2 RC](https://dev.classmethod.jp/en/articles/qwik-2-rc-changes/), [adapter Vercel Qwik](https://qwik.dev/docs/deployments/vercel-edge), [e18e framework tracker](https://def574a2.framework-tracker.pages.dev/run-time), [perbandingan performa 2026](https://tobias-belch.github.io/brain/tools/web-framework-performance-complexity-2026/).

Catatan: repo lama `KaisAbiyyi/naratia` berisi boilerplate Next.js 15. Rencana ini menggantinya.

## 2. Stack

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Web | SvelteKit + Svelte 5, TypeScript, `@sveltejs/adapter-vercel` (runtime Node) | Ringan, SSR bagus untuk halaman cerita, satu bahasa dari depan sampai belakang |
| Styling | CSS biasa dengan token (port langsung dari prototipe Stabilo) | Token terang/gelap sudah jadi. Tidak perlu library UI. |
| Database | Supabase Postgres | Postgres penuh: transaksi, fungsi, `pg_cron`, RLS |
| Auth | Supabase Auth (magic link email + Google) | Tanpa password untuk dikelola sendiri |
| ORM / migrasi | Drizzle (skema & migrasi) + fungsi SQL untuk operasi ekonomi | Drizzle untuk query biasa. Operasi tinta harus atomik, jadi ditaruh di fungsi Postgres. |
| Realtime | Supabase Realtime (nanti) | Update suara keberatan dan ronde tanpa refresh. Tidak wajib di awal. |
| Penjadwal | `pg_cron` di Supabase, tiap menit | Menutup ronde tepat waktu tanpa bergantung pada cron Vercel |
| Region | Vercel `sin1` + Supabase `ap-southeast-1` (Singapura) | Paling dekat ke Indonesia, dan server dekat dengan database |
| Test | Vitest (logika murni), Playwright (alur penuh, mengikuti 11 langkah prototipe) | Alur prototipe jadi skenario e2e utama |

## 3. Prinsip arsitektur

1. **Server yang memutuskan.** Semua yang menyentuh tinta, suara, keberatan, dan penutupan ronde divalidasi di server. Klien hanya mengirim niat.
2. **Logika domain di Postgres.** Operasi seperti `submit_candidate`, `cast_vote`, `file_objection`, `close_round`, dan `record_reads` adalah fungsi SQL dalam satu transaksi. SvelteKit (dan nanti aplikasi mobile) cukup memanggilnya. Dengan begitu logika tidak ditulis dua kali saat mobile datang.
3. **Ledger tinta append-only.** Saldo = jumlah baris ledger. Tidak ada `UPDATE saldo`. Setiap baris punya `reason` dan `ref` ke objek penyebabnya, jadi riwayat tinta di aplikasi langsung bisa ditampilkan.
4. **Jejak dihitung, bukan disimpan.** Statistik Jejak berupa view atau materialized view dari tabel paragraf, keberatan, dan thread.
5. **RLS menyala di semua tabel.** Klien hanya bisa membaca. Semua tulis lewat fungsi `security definer` yang memeriksa aturan.

## 4. Model data (draft)

```
profiles        id, username, created_at
stories         id, title, genre, mode(solo|collab), license, status(active|sleeping|ended), created_by
chapters        id, story_id, number, status(open|voting|closed)
paragraphs      id, story_id, chapter_id, idx, author_id, body, process_json, wound(bool), created_at
rounds          id, story_id, number, holder_id, preset(kilat|normal|panjang), constraint_key,
                opens_at, closes_at, extended_count, status(open|closed), winner_candidate_id
candidates      id, round_id, author_id, body, process_json, thread_claims, status(active|disqualified|won|lost)
votes           round_id, voter_id, candidate_id            -- unik (round_id, voter_id)
reads           user_id, paragraph_id, read_at, dwell_ms    -- unik (user_id, paragraph_id)
cards           id, user_id, paragraph_id, start, end, snapshot, created_at
threads         id, story_id, name, kind(normal|plot_hole), opened_paragraph_id, last_paragraph_id, status
thread_proposals id, story_id, proposer_id, card_id, supports, status
objections      id, candidate_id|paragraph_id, reporter_id, reason_key, evidence_card_ids, stake, status(open|valid|invalid|dispute)
rulings         objection_id, user_id, verdict              -- unik per orang
questions       id, paragraph_id, asker_id, body, answered_by_paragraph_id   -- Penanya
ledger          id, user_id, delta, reason, ref_type, ref_id, created_at
bounties        id, thread_id, funder_id, amount, burned, status
daily_progress  user_id, day, read_vote_tinta, tasks_json   -- batas 25/hari
follows         (P6)
```

## 5. Alur kritis

### Penutupan ronde (`close_round`)
Dipanggil `pg_cron` tiap menit untuk semua ronde dengan `closes_at <= now()`, plus dipanggil malas saat halaman ronde dibuka. Fungsinya idempoten. Urutannya mengikuti design doc §2 dan §4:

1. Putus keberatan: mayoritas putusan → sah/tidak sah. Tanpa putusan → sengketa.
2. Kandidat dengan keberatan sah → gugur.
3. Hitung suara. Seri → kiriman paling awal.
4. Aturan tanpa suara: 1 kandidat → diterima. >1 kandidat → pemegang estafet memilih (kalau bukan kandidat), selain itu perpanjang sekali lalu undi. 0 kandidat → perpanjang, lalu tandai tidur.
5. Tambahkan paragraf pemenang ke narasi, perbarui thread yang disentuh atau ditutup.
6. Bayar: menang × pengali, thread, keberatan, pengembalian 5 untuk yang kalah bersih, bounty.
7. Buka ronde berikutnya dengan pemegang estafet = pemenang.

Seluruh langkah berjalan dalam satu transaksi.

### Deteksi membaca (`record_reads`)
- Klien memakai IntersectionObserver (seperti di prototipe) dan mengirim batch `{paragraph_id, dwell_ms}`.
- Server menerima paragraf sebagai terbaca kalau `dwell_ms` ≥ waktu minimum yang sebanding dengan panjang teks `[TBD, misalnya 15 ms per karakter, minimal 4 detik]`.
- Status terbaca selalu dicatat, karena itu syarat membuka tombol Pilih dan Tulis. Tinta +2 hanya dibayar selama batas harian 25 belum habis.

### Integritas tulisan
Blokir paste, sprint, dan badge proses ada di klien. `process_json` dari klien hanya untuk ditampilkan, bukan untuk menghukum, sesuai design doc §9.

## 6. Tahapan pengerjaan web

> Rincian per work package, termasuk langkah cek di aplikasi, ada di [`work-packages.md`](work-packages.md). Di sana ledger tinta (WP-08) dikerjakan sebelum Continuity Cop (WP-09), karena keberatan butuh taruhan tinta. Tabel di bawah adalah ringkasan awal.

| Milestone | Isi | Selesai kalau… |
|---|---|---|
| **M0 · Fondasi** | Repo, SvelteKit + adapter Vercel, Supabase (dev & prod), Drizzle, auth magic link + Google, token Stabilo, layout dasar, CI (lint, typecheck, test), preview deploy per PR | Login berhasil di preview Vercel, dan halaman kosong sudah bertema Stabilo terang/gelap |
| **M1 · Core loop (P0)** | Buat cerita (solo & kolaborasi), baca narasi, ronde dengan preset durasi, kirim kandidat (blokir paste), pilih, `close_round` lengkap dengan aturan tanpa suara, pemegang estafet, bab dan voting akhir bab | Satu cerita bisa berjalan 3 ronde berturut-turut dengan 2 akun, termasuk ronde tanpa suara yang berakhir undian |
| **M2 · Membaca jadi senjata (P1)** | `record_reads` + gerbang membaca, kartu kutipan, Threads (usul, dukung, ambil, tutup, tingkat basi) | Tombol Pilih terkunci sampai semua paragraf baru terbaca. Thread basi terlihat di papan. |
| **M3 · Continuity Cop + Penanya (P2)** | Keberatan dengan bukti kartu, putusan pembaca, sengketa, luka kontinuitas, utang cerita | Alur langkah 5–6 prototipe berjalan dengan data asli |
| **M4 · Ekonomi (P3)** | Ledger, semua angka v0.3, batas harian, Jejak, task & streak, bounty thread, cabang | Riwayat tinta cocok dengan hitungan manual untuk skenario prototipe (50 → 120) |
| **M5 · Integritas (P4)** | Sprint, badge proses, rate limit | Badge proses tampil di setiap paragraf |
| **M6 · AI penanya (P5)** | Ditunda sampai ekonomi stabil | — |
| **M7 · Monetisasi (P6)** | Ikuti, langganan cerita solo, pembayaran web | — |

Setiap milestone dimulai dengan migrasi skema dan test fungsi SQL-nya, baru UI.

## 7. Biaya dan batasan

- **Vercel Hobby** hanya boleh untuk penggunaan non-komersial. Sebelum langganan berbayar (M7) diluncurkan, pindah ke paket Pro.
- **Supabase Free** menjeda project yang tidak aktif selama seminggu. Untuk tahap awal masih aman, tapi project prod sebaiknya dipindah ke paket berbayar begitu ada pengguna lain.
- `pg_cron` per menit cukup untuk penutupan ronde. Ronde Kilat (1 jam) toleran terhadap telat beberapa detik.

## 8. Risiko

| Risiko | Penanganan |
|---|---|
| `close_round` rumit dan rawan bug | Ditulis sebagai fungsi SQL dengan test per aturan di tabel design doc §2 |
| Batas tinta harian bisa diakali lewat banyak akun | Diterima dulu. Tinta tidak bisa ditukar uang, jadi taruhannya kecil. |
| Logika tergandakan saat mobile datang | Semua aturan domain di Postgres (§3.2) |
| Perubahan besar SvelteKit (misalnya rilis mayor baru) | Kunci versi stabil saat M0, dan upgrade di milestone tersendiri |

## 9. Rencana mobile (nanti, setelah M4)

| Tahap | Isi | Alasan |
|---|---|---|
| **A · PWA** | Manifest + service worker: bisa dipasang di layar utama, cache cerita untuk dibaca offline, Web Push untuk "ronde hampir ditutup" (iOS mendukung push untuk PWA yang sudah dipasang) | Hampir gratis, karena memakai kode web yang sama |
| **B · Capacitor** | Bungkus build SvelteKit mode SPA ke aplikasi Android/iOS. Push native (FCM/APNs), share, haptic. Data lewat fungsi Postgres yang sama. | Satu basis kode UI. Naratia berbasis teks, jadi tidak butuh performa native. |
| Ditolak | React Native/Expo (basis kode kedua), Tauri 2 mobile (belum matang untuk kasus ini) | — |

Yang perlu diputuskan sebelum tahap B:
- **Pembayaran langganan di dalam aplikasi toko.** Design doc memilih pembayaran web untuk menghindari potongan toko. Aturan Apple dan Google soal tautan ke pembayaran luar berbeda per negara dan terus berubah. Cek ulang saat tahap B dimulai.
- Apakah aplikasi mobile ikut menjual langganan, atau hanya untuk membaca dan menulis.

## 10. Langkah pertama (M0)

Diputuskan: lanjut di `KaisAbiyyi/naratia`, branch `v2`, repo tetap private. Langkah pertamanya adalah WP-01 dan WP-02 di [`work-packages.md`](work-packages.md).
