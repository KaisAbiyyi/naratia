# Naratia — Alur Kerja Work Package (WP)

> Berlaku untuk rebuild v2 (SvelteKit). Daftar WP ada di [`work-packages.md`](work-packages.md).

## Masalah yang mau dicegah

Di proyek sebelumnya (CineMatch, Mind-Place) task banyak selesai, tapi pemilik kehilangan gambaran aplikasinya terlihat seperti apa. Di Naratia **setiap WP harus menghasilkan sesuatu yang bisa dibuka dan diklik**, dan pemilik selalu membukanya sebelum WP dianggap selesai.

## Ukuran WP

Satu WP = **satu irisan vertikal yang bisa diklik**: database → server → UI → test → preview deploy. Ukurannya pas untuk salah satu dari dua cara kerja ini:

| Cara kerja | Kapan dipakai | Contoh |
|---|---|---|
| **Single agent kuat** | Pekerjaan yang butuh satu kepala yang konsisten: aturan ekonomi, auth/RLS, fondasi | Sonnet, 6.2 Sol, Hydrogen |
| **Orkestrasi** (1 pengatur + 2–3 pekerja) | Pekerjaan yang bisa dipecah jadi bagian yang tidak saling menimpa file: misalnya fungsi SQL + test di satu sisi, layar UI di sisi lain | Sonnet → Haiku, Sol → Luna, Argon/Neon → Hydrogen |

Patokan ukuran:
- Selesai dalam satu sesi agent (atau satu run orkestrasi), tanpa perlu ditunda di tengah.
- Selalu mengubah sesuatu yang **terlihat** di aplikasi. WP yang murni backend tetap wajib punya cara melihat hasilnya (misalnya layar hasil, panel `/dev`).
- Kalau sebuah WP butuh lebih dari ~3 layar baru atau lebih dari ~3 fungsi SQL besar, pecah jadi dua.

## Lingkungan kerja

- **Cloud dulu.** Semua WP dirancang bisa dikerjakan agent cloud (Claude Code di web atau sejenisnya) dari repo ini.
- **Lokal boleh** kalau agent yang ditugaskan memang agent lokal. Aturannya sama.
- Langkah yang hanya bisa dilakukan pemilik (membuat project Supabase, OAuth Google, mengisi env Vercel) ditulis di bagian **Kamu lakukan** di setiap WP, dan harus beres sebelum WP diklaim.

## Branch dan deploy

```
main          ← versi lama (Next.js), dibiarkan
v2            ← integrasi rebuild. Vercel production branch selama rebuild.
wp/NN-slug    ← satu branch per WP, PR ke v2
```

- Setiap PR ke `v2` otomatis punya **preview URL** dari Vercel.
- Branch `v2` sendiri punya URL tetap: **aplikasi terkini**. Bookmark URL ini.
- Merge hanya setelah pemilik selesai mengecek preview.

## Status WP

```
Backlog → Siap → Dikerjakan → Siap dicek → (Revisi ↺) → Selesai
                     ↘ Terblokir
```

| Status | Artinya | Siapa yang memindah |
|---|---|---|
| Siap | Semua "Kamu lakukan" sudah beres, WP sebelumnya sudah Siap dicek | Pemilik |
| Dikerjakan | Agent sedang mengerjakan di `wp/NN-slug` | Agent |
| Siap dicek | PR terbuka, CI hijau, preview jalan, checklist di PR | Agent |
| Revisi | Pemilik minta penyesuaian UI/alur setelah mengecek | Pemilik |
| Selesai | Pemilik sudah mengecek, PR di-merge ke `v2` | Pemilik |

**Aturan antrean:** paling banyak **satu** WP berstatus Siap dicek yang belum dicek pemilik. Kalau sudah ada satu, agent berikutnya tidak memulai WP baru sampai pemilik mengecek. Ini yang menjaga pemilik selalu tahu wujud aplikasinya.

## Definisi selesai (agent)

Sebuah WP baru boleh dipindah ke Siap dicek kalau:

1. Semua kriteria **Selesai kalau** di WP terpenuhi, termasuk test.
2. CI hijau (lint, typecheck, unit test, Playwright).
3. Preview Vercel bisa dibuka, dan data contoh sudah ter-seed di sana.
4. **Peta WP** di `/dev` diperbarui: WP ini bertanda selesai, lengkap dengan langkah cek dan tautan langsung ke halaman yang relevan.
5. Deskripsi PR berisi:
   - ringkasan perubahan,
   - tautan preview,
   - screenshot HP (390 px) dan desktop, tema terang dan gelap,
   - checklist **Cek di aplikasi** yang disalin dari WP,
   - hal yang sengaja belum dikerjakan.
6. Status di Notion dan `work-packages.md` diperbarui.

## Cek oleh pemilik

1. Buka preview dari PR (atau Peta WP di `/dev`).
2. Jalankan checklist **Cek di aplikasi**, di HP dan di laptop.
3. Hasilnya salah satu:
   - **OK** → merge, status Selesai.
   - **Perlu revisi** → tulis komentar di PR (apa yang kurang pas di UI/alur). Agent memperbaikinya di PR yang sama.

## Panel `/dev`

Hanya aktif di lingkungan dev dan preview (dikunci variabel env, tidak pernah di production). Isinya bertambah per WP:

- **Peta WP**: semua WP, statusnya, dan langkah cek dengan tautan langsung.
- **Masuk sebagai akun uji**: ganti akun dalam satu klik.
- **Reset data contoh**.
- **Kontrol waktu**: tutup ronde sekarang, majukan waktu.
- **Jalankan skenario prototipe** (mulai WP-08): menjalankan 11 langkah prototipe dengan akun uji, lalu menampilkan riwayat tinta.

## Brief untuk agent

Saat menugaskan WP ke agent, cukup kirim:

```
Kerjakan WP-NN dari docs/work-packages.md di repo KaisAbiyyi/naratia, branch dasar v2.
Ikuti CLAUDE.md dan docs/workflow.md. Rujukan perilaku: docs/design.md, docs/tech-plan.md,
dan prototipe prototype/naratia-alur.html (gaya Stabilo).
Mode: <single | orkestrasi — pengatur X, pekerja Y>.
```
