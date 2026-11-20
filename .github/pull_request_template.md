## WP

WP-NN · <judul> — rujukan: `docs/work-packages.md`

## Ringkasan

<!-- Apa yang berubah, dari sudut pandang pengguna -->

## Preview

- Tautan preview:
- Halaman yang relevan:

## Screenshot

| | Terang | Gelap |
|---|---|---|
| HP (390 px) | | |
| Desktop | | |

## Cek di aplikasi (untuk pemilik)

<!-- Salin dari WP -->
- [ ]

## Prioritas utama — diisi agent, diperiksa ulang reviewer

### Performa
- [ ] Halaman baru/berubah di-render server bila berisi konten cerita
- [ ] Tidak ada query N+1, dan setiap pola query punya index
- [ ] JS awal per rute dalam anggaran (`docs/workflow.md`). Angkanya:
- [ ] LCP halaman cerita di HP dalam anggaran. Angkanya:

### Kompleksitas algoritma
- [ ] Logika berbasis himpunan di SQL, tanpa loop per baris di aplikasi
- [ ] Jalur panas tidak memindai seluruh riwayat (ledger, reads, votes)
- [ ] Kompleksitas jalur penting:

### Keamanan
- [ ] RLS aktif di tabel baru, dan ada test yang membuktikan tulis langsung ditolak
- [ ] Tulis hanya lewat fungsi yang memeriksa `auth.uid()` dan aturan game
- [ ] Input divalidasi di server. Tidak ada `{@html}` untuk teks pengguna.
- [ ] Tidak ada rahasia di klien. `/dev` tetap terkunci di production.
- [ ] Aksi yang bisa di-spam punya rate limit (kalau relevan)

### UI/UX
- [ ] Mengikuti gaya Stabilo dan prototipe
- [ ] Nyaman di HP 390 px, area sentuh ≥ 44 px
- [ ] Kontras lolos di terang dan gelap, fokus keyboard terlihat
- [ ] Ada state kosong, memuat, dan error
- [ ] Teks UI Bahasa Indonesia yang jelas

## Hal yang sengaja belum dikerjakan

-

## Catatan reviewer

<!-- Reviewer: tulis hasil cek empat prioritas di atas, bukan hanya fungsionalitas -->
