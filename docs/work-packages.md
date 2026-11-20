# Naratia — Work Packages

> Alur kerja dan definisi selesai: [`workflow.md`](workflow.md). Rujukan: [`design.md`](design.md), [`tech-plan.md`](tech-plan.md), [`prototype/naratia-alur.html`](../prototype/naratia-alur.html).
> Status terkini juga ada di Notion: *Naratia · Work Packages*.

## Ringkasan

| WP | Judul | Milestone | Mode | Lingkungan | Bergantung | Status |
|---|---|---|---|---|---|---|
| 01 | Fondasi SvelteKit & deploy | M0 | Single | Cloud + Pemilik | – | Review |
| 02 | Supabase, auth, skema inti & data contoh | M0 | Single kuat | Cloud + Pemilik | 01 | Backlog |
| 03 | Baca & tulis cerita (solo) | M1 | Orkestrasi | Cloud | 02 | Backlog |
| 04 | Ronde, suara & penutupan ronde | M1 | Orkestrasi | Cloud | 03 | Backlog |
| 05 | Pemegang estafet, bab & cerita tidur | M1 | Single | Cloud | 04 | Backlog |
| 06 | Gerbang membaca & kartu kutipan | M2 | Single | Cloud | 04 | Backlog |
| 07 | Threads | M2 | Orkestrasi | Cloud | 06 | Backlog |
| 08 | Tinta & ledger | M3 | Single kuat | Cloud | 07 | Backlog |
| 09 | Continuity Cop | M3 | Orkestrasi | Cloud | 08 | Backlog |
| 10 | Penanya, Jejak, tugas & streak | M3 | Orkestrasi | Cloud | 08 | Backlog |
| 11 | Bounty, cabang & bangunkan cerita | M3 | Single | Cloud | 09 | Backlog |
| 12 | Integritas tulisan & PWA dasar | M4 | Single | Cloud | 08 | Backlog |
| 13 | Panduan pertama kali | M4 | Single | Cloud | 09 | Backlog |

Urutan default berjalan satu per satu, sesuai aturan antrean di `workflow.md`. Setelah M4, rencana berikutnya adalah AI penanya (M5), monetisasi (M6), dan Capacitor (lihat `tech-plan.md` §9). Ketiganya belum dipecah jadi WP.

Catatan urutan: ledger tinta (WP-08) sengaja dikerjakan sebelum Continuity Cop (WP-09), karena keberatan butuh taruhan tinta. Ini berbeda dengan urutan fase di `design.md` §11.

---

## WP-01 · Fondasi SvelteKit & deploy

- **Milestone:** M0 · **Mode:** single agent (Sonnet / Hydrogen) · **Lingkungan:** Cloud + Pemilik
- **Kamu lakukan dulu:**
  - Import repo ke Vercel. Set production branch = `v2`, region fungsi = Singapore (`sin1`).
  - Pastikan GitHub Actions aktif di repo.
- **Isi:**
  - Hapus boilerplate Next.js (dokumen lama sudah dipindah ke `docs/archive/2025-nextjs/`).
  - Scaffold SvelteKit (Svelte 5, TypeScript, pnpm, Node 24) dengan `@sveltejs/adapter-vercel`, runtime Node, region `sin1`.
  - Pindahkan token gaya Stabilo dari prototipe (terang + gelap) ke `src/lib/styles/`.
  - Komponen dasar: Button, Chip, Pill, Card, Tabs, Sheet, Toast.
  - Kerangka aplikasi: app bar, tema mengikuti sistem dengan tombol ganti tema.
  - Beranda statis dengan data dummy, meniru layar Beranda prototipe.
  - Panel `/dev` (aktif hanya jika `PUBLIC_DEV_PANEL=1`) berisi **Peta WP** dari `src/lib/dev/wp-map.ts`.
  - CI GitHub Actions: lint, `svelte-check`, Vitest, Playwright smoke test.
  - Isi bagian "Perintah" di `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, dan `.github/copilot-instructions.md` (isinya harus tetap sama).
- **Di luar scope:** database, auth.
- **Selesai kalau:** CI hijau dan preview Vercel tampil.
- **Cek di aplikasi:**
  1. Buka preview di HP dan laptop. Beranda tampil dengan gaya Stabilo (garis tebal, bayangan padat).
  2. Ganti tema HP/OS ke gelap, atau pilih tema di menu profil. Semua teks tetap terbaca.
  3. Buka `/dev`. Peta WP menampilkan WP-01 selesai dan WP-02 berikutnya.

## WP-02 · Supabase, auth, skema inti & data contoh

- **Milestone:** M0 · **Mode:** single agent kuat (6.2 Sol / Sonnet). Auth dan RLS butuh ketelitian. · **Lingkungan:** Cloud + Pemilik
- **Kamu lakukan dulu:**
  - Buat project Supabase dev di region Singapore.
  - Buat OAuth client Google dan aktifkan provider Google di Supabase.
  - Isi env Supabase di Vercel (Preview + Production) dan di GitHub Actions secrets.
  - Beri agent cloud akses lewat secret environment (`SUPABASE_ACCESS_TOKEN`, `DATABASE_URL`).
- **Isi:**
  - Drizzle: konfigurasi dan migrasi tabel `profiles`, `stories`, `chapters`, `paragraphs`, `rounds`, `candidates`, `votes`.
  - RLS: semua orang boleh membaca, tulis hanya lewat fungsi.
  - Supabase Auth SSR (`hooks.server.ts`): login magic link + Google, onboarding username, halaman profil sederhana.
  - Seed: 3 akun uji (`kamu_uji`, `lentera`, `ombak`) dan cerita "Mercusuar Pulau Garam" (6 paragraf dari prototipe) dengan ronde 7 terbuka berisi 2 kandidat.
  - `/dev`: tombol "Masuk sebagai akun uji" (khusus preview) dan "Reset data contoh".
- **Selesai kalau:** test membuktikan pengguna tidak bisa menulis langsung ke tabel paragraf, dan login berjalan di preview.
- **Cek di aplikasi:**
  1. Login dengan email atau Google, lalu pilih username.
  2. Beranda menampilkan cerita contoh dari database, bukan dummy lagi.
  3. Di `/dev`, masuk sebagai `lentera`. Nama di header ikut berubah.

## WP-03 · Baca & tulis cerita (solo)

- **Milestone:** M1 · **Mode:** orkestrasi (Sonnet → Haiku). Pengatur menangani rute, data, dan fungsi SQL. Pekerja membuat komponen layar. · **Lingkungan:** Cloud
- **Isi:**
  - Halaman cerita (SSR), tab Narasi: nomor ¶, penanda penulis dan waktu, pemisah bab.
  - Buat cerita: judul, genre, mode solo/kolaborasi, paragraf pembuka. Cerita kolaborasi otomatis punya record ronde 1, tapi UI-nya baru di WP-04.
  - Komponen editor paragraf yang dipakai ulang: 300–1000 karakter, penghitung, blokir paste dan drop, catatan proses (durasi dan revisi).
  - Mode solo: tambah paragraf langsung.
  - "Ceritaku" di profil. Beranda memakai data nyata.
- **Selesai kalau:** fungsi `append_solo_paragraph` punya test, dan editor ditest untuk penolakan paste.
- **Cek di aplikasi:**
  1. Buat cerita solo, lalu tulis 2 paragraf lanjutan.
  2. Coba paste ke editor. Ditolak dengan pesan.
  3. Buka cerita di HP. Setiap paragraf punya nama, waktu, dan badge proses.

## WP-04 · Ronde, suara & penutupan ronde

- **Milestone:** M1 · **Mode:** orkestrasi (Sol → Luna). Pengatur menulis `close_round` dan test SQL-nya. Pekerja membuat tab Ronde dan layar hasil. · **Lingkungan:** Cloud
- **Isi:**
  - Tab Ronde: nomor ronde, durasi, waktu tutup, pemegang estafet, kandidat anonim, kirim kandidat (memakai editor WP-03).
  - Memilih: satu suara per ronde, tidak untuk tulisan sendiri, jumlah suara disembunyikan.
  - Fungsi SQL `submit_candidate`, `cast_vote`, `close_round` mengikuti urutan `tech-plan.md` §5. Hook untuk keberatan dan tinta disiapkan, isinya belakangan.
  - Aturan tanpa suara lengkap. Seri → kiriman paling awal.
  - `pg_cron` tiap menit, plus penutupan malas saat halaman dibuka.
  - Layar hasil ronde seperti di prototipe.
  - `/dev`: "Tutup ronde sekarang", "Majukan waktu 1 jam", "Tambah kandidat dari akun uji".
- **Selesai kalau:** setiap baris tabel aturan ronde (`design.md` §2) punya test.
- **Cek di aplikasi:**
  1. Dengan 3 akun uji: kirim 2 kandidat, beri suara, tutup ronde lewat `/dev`. Pemenang masuk narasi dengan namanya.
  2. Ronde dengan 1 kandidat tanpa suara → otomatis diterima.
  3. Ronde dengan 2 kandidat tanpa suara, dan pemegang estafet ikut menulis → ronde diperpanjang, lalu pemenangnya diundi.

## WP-05 · Pemegang estafet, bab & cerita tidur

- **Milestone:** M1 · **Mode:** single (Sonnet) · **Lingkungan:** Cloud
- **Isi:**
  - Sheet pemegang estafet setelah menang: preset Kilat/Normal/Panjang, dan menu constraint dengan syarat ≥ 3 paragraf diterima (lengkap dengan progress bar).
  - Constraint tampil di tab Ronde dan di editor, dengan peringatan pelanggaran sederhana.
  - Bab: ukuran per cerita (default 20), voting lanjut/tamat di akhir bab, status tamat.
  - Cerita tidur setelah beberapa kali diperpanjang, dengan label di Beranda.
  - Notifikasi dalam aplikasi (ikon lonceng): menang ronde, ronde hampir ditutup.
- **Cek di aplikasi:**
  1. Menangkan ronde dengan akun uji. Sheet estafet muncul.
  2. Akun dengan 1 paragraf melihat constraint terkunci (1/3). `lentera` bisa memasang "Tanpa dialog".
  3. Di `/dev`, set ukuran bab = 5 untuk memicu voting akhir bab.

## WP-06 · Gerbang membaca & kartu kutipan

- **Milestone:** M2 · **Mode:** single (Sonnet) · **Lingkungan:** Cloud
- **Isi:**
  - Tabel `reads` dan `cards`. `record_reads` dengan waktu baca minimum sebanding panjang paragraf.
  - Tanda "baru" dan readbar di narasi.
  - Gerbang: Pilih dan Tulis terkunci sampai semua paragraf baru terbaca.
  - Blokir copy di teks cerita.
  - Ketuk kalimat (HP) atau blok teks (desktop) untuk menyimpan kartu: offset, snapshot, dan nilai. Sheet kartu. Kalimat yang dikutip menyala kuning.
- **Cek di aplikasi:**
  1. Sebagai akun baru, tombol Pilih terkunci dengan tulisan "0/6".
  2. Gulir pelan, tombol terbuka. Gulir cepat sekali lewat tidak dihitung sebagai membaca.
  3. Simpan kartu di HP (ketuk) dan di desktop (blok teks).

## WP-07 · Threads

- **Milestone:** M2 · **Mode:** orkestrasi (Argon/Neon → Hydrogen) · **Lingkungan:** Cloud
- **Isi:**
  - Menandai frasa sebagai thread saat menulis.
  - Usulan thread dari pembaca dengan kartu, dukungan, gabung otomatis kalau kutipannya tumpang tindih, dan kedaluwarsa.
  - Papan thread diurutkan berdasarkan tingkat basi dan dukungan. Frasa thread distabilo pink di narasi.
  - Klaim ambil/tutup thread saat mengirim kandidat, dengan syarat kartu.
  - `close_round` memperbarui thread. Bonus dicatat sebagai "menunggu pembayaran" sampai WP-08.
- **Cek di aplikasi:**
  1. Langkah 3–4 prototipe berjalan dengan data asli.
  2. Ambil thread basi lalu menang. Thread berpindah jadi "baru disentuh".

## WP-08 · Tinta & ledger

- **Milestone:** M3 · **Mode:** single agent kuat (6.2 Sol). Ketepatan angka. · **Lingkungan:** Cloud
- **Isi:**
  - Ledger append-only, saldo, chip tinta, sheet riwayat.
  - Semua angka v0.3 dalam satu file konfigurasi: saldo awal 50, baca +2 dan suara +3 dengan batas 25/hari, kirim −10, kalah bersih +5, menang × pengali, sprint +5, bonus thread, usul thread −3/+10.
  - `daily_progress`. Pembayaran di `close_round`, termasuk bonus thread dari WP-07.
  - `/dev`: "Jalankan skenario prototipe".
- **Selesai kalau:** test skenario prototipe menghasilkan riwayat yang sama persis. Skenario dengan keberatan dites setelah WP-09.
- **Cek di aplikasi:**
  1. Jalankan skenario di `/dev`. Riwayat tinta sama dengan langkah terakhir prototipe.
  2. Baca dan pilih terus sampai batas harian. Tinta berhenti bertambah, tapi gerbang membaca tetap terbuka.

## WP-09 · Continuity Cop

- **Milestone:** M3 · **Mode:** orkestrasi · **Lingkungan:** Cloud
- **Isi:**
  - Ajukan keberatan: bukti dari kartu atau kalimat yang ditarik langsung, jenis masalah, taruhan 10.
  - Pembelaan penulis dengan kartu tandingan. Putusan pembaca.
  - Diskualifikasi, lalu revisi dan kirim ulang selama ronde masih berjalan.
  - Sengketa. Luka kontinuitas + thread plot hole + bonus tambal +40.
  - Terintegrasi dengan `close_round` dan ledger.
- **Cek di aplikasi:**
  1. Langkah 5–6 prototipe (Seruni vs Sekar) dengan data contoh. Keberatan sah memberi +25.
  2. Keberatan yang tidak sah memindahkan taruhan ke penulis.
  3. Sengketa yang diputus setelah paragraf masuk narasi memunculkan luka kontinuitas.

## WP-10 · Penanya, Jejak, tugas & streak

- **Milestone:** M3 · **Mode:** orkestrasi (Sonnet → Haiku) · **Lingkungan:** Cloud
- **Isi:**
  - Utang cerita: tanya di paragraf, dijawab di narasi, divalidasi penanya atau voter, +10.
  - Profil dengan Jejak.
  - Tugas harian di menu profil (ikon profil di app bar), termasuk tugas yang butuh membaca.
  - Streak baca, tulis, dan suara, plus kombo.
- **Cek di aplikasi:**
  1. Menu profil menampilkan tugas dan streak hari ini.
  2. Tanya di sebuah paragraf, lalu jawab dari akun lain lewat kandidat yang menang.
  3. Profil menampilkan Jejak, bukan saldo tinta.

## WP-11 · Bounty, cabang & bangunkan cerita

- **Milestone:** M3 · **Mode:** single (Sonnet) · **Lingkungan:** Cloud
- **Isi:**
  - Bounty thread: pasang, tambah, 10% dibakar, dibayar, atau dikembalikan.
  - Cabang dari paragraf yang kalah (150).
  - Bangunkan cerita tidur (30).
- **Cek di aplikasi:**
  1. Pasang bounty 50 di sebuah thread, lalu menangkan dari akun lain. Bounty cair 45.
  2. Buat cabang dari kandidat yang kalah.

## WP-12 · Integritas tulisan & PWA dasar

- **Milestone:** M4 · **Mode:** single · **Lingkungan:** Cloud
- **Isi:**
  - Sprint 10 menit di editor beserta bonusnya. Badge proses dirapikan.
  - Rate limit untuk kirim kandidat dan keberatan.
  - PWA: manifest, ikon, service worker untuk membaca offline.
- **Cek di aplikasi:**
  1. Pasang aplikasi ke layar utama HP.
  2. Matikan internet. Cerita yang pernah dibuka tetap bisa dibaca.

## WP-13 · Panduan pertama kali

- **Milestone:** M4 · **Mode:** single · **Lingkungan:** Cloud
- **Isi:** pindahkan panduan berpemandu dari prototipe ke aplikasi asli untuk pengguna baru: cincin penanda, satu instruksi per langkah, Lewati.
- **Cek di aplikasi:**
  1. Daftar dengan akun baru. Panduan muncul dan bisa diselesaikan, atau dilewati.
