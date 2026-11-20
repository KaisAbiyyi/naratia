# Naratia — Dokumen Desain & Mekanik Game

> Status: draft v0.3 (20 Nov 2026). v0.3: ekonomi tinta direvisi, Jejak dipisah dari tinta, bounty thread, monetisasi jangka panjang. Menggantikan arah "stealth education" di PRD lama (`KaisAbiyyi/naratia/docs/prd.md`, Sep 2025).
> Angka bertanda `[TBD]` adalah placeholder untuk di-tuning setelah dicoba.

## 1. Visi

Naratia adalah game menulis cerita bersama. Tujuan pribadinya adalah membangun rutinitas menulis cerita, karena menyusun cerita yang koheren memaksa otak bekerja keras. Prinsipnya:

- **Seru dulu.** Gamifikasi besar, bukan aplikasi belajar.
- **Membaca jadi senjata, bukan syarat.** Tidak ada gerbang kuis atau gerbang waktu. Pemain yang membaca lebih teliti akan menang lebih banyak.
- **Klaim jujur.** Tidak ada klaim "IQ naik" atau "latihan otak". Yang boleh diklaim hanya "makin jago menulis dan membaca cerita di Naratia" (lihat *Fondasi Cognitive Science untuk Tarkana & Naratia*).
- **Harus tetap jalan walaupun sepi.** Kondisi tanpa voter adalah default, bukan pengecualian.
- **AI di layer terakhir.** Baru masuk kalau ekonomi app sudah stabil atau surplus (lihat §9).

## 2. Core loop

```
Auth → Buat cerita (judul, genre, paragraf pembuka)
     → Ronde dibuka
         → Kandidat paragraf masuk (dari orang lain, dari diri sendiri, atau keduanya)
         → Pembaca membaca, mengumpulkan kartu kutipan, voting, mengajukan keberatan
     → Ronde ditutup → pemenang menyambung ke narasi utama
         (dengan penanda: ditulis oleh siapa, kapan)
     → Ronde berikutnya … → cerita selesai / diarsipkan
```

### Aturan ronde

| Kondisi saat timer habis | Hasil |
|---|---|
| Ada suara | Kandidat dengan suara terbanyak menang. Tie-break: kiriman paling awal. |
| Tidak ada suara, 1 kandidat | Kandidat itu otomatis diterima. |
| Tidak ada suara, >1 kandidat | Pemegang estafet memilih, kalau dia bukan kandidat. Kalau dia kandidat, atau tidak memilih dalam `[TBD]` jam: ronde diperpanjang sekali. Kalau masih tidak ada suara: **diundi**. |
| Tidak ada kandidat | Ronde diperpanjang. Setelah `[TBD]` kali diperpanjang, cerita ditandai "tidur". |

- Tidak boleh vote tulisan sendiri. Satu suara per ronde.
- Jumlah suara disembunyikan selama ronde berjalan.
- Nama penulis kandidat disembunyikan sampai ronde ditutup. Notifikasi ke pengikut seorang penulis ("X mengirim kandidat") juga ditahan sampai ronde ditutup, supaya pengikut tidak bisa mengerahkan suara untuk idolanya.
- Ronde tidak ditutup lebih awal berdasarkan suara minimum. Aturan itu baru dipertimbangkan kalau user sudah banyak.
- **Mode solo** (dipilih saat membuat cerita): penulis menulis berturut-turut tanpa ronde voting. Threads, streak, dan task tetap jalan. Membuat dan menulis cerita solo **gratis, tapi tidak menghasilkan tinta**, karena tujuannya latihan. Jangka panjang, cerita solo bisa menghasilkan uang sungguhan lewat pengikut dan langganan (§7, Monetisasi).

### Kepemilikan

- **Tidak ada pemilik cerita.** Setiap orang hanya memiliki paragraf yang dia tulis. Pembuat cerita = penulis paragraf pembuka, tanpa hak khusus.

### Lisensi

Hak cipta lahir otomatis saat tulisan dibuat (UU No. 28/2014), jadi setiap paragraf adalah milik penulisnya. Tanpa lisensi, menyusun cerita kolaborasi jadi buku, membuat cabang, atau menampilkan ulang butuh izin dari setiap penulis. Lisensi menyelesaikan masalah itu sejak awal. Untuk karya tulis, padanan lisensi MIT di kode adalah **Creative Commons**.

| Jenis cerita | Lisensi | Artinya |
|---|---|---|
| Kolaborasi | **CC BY-NC-SA 4.0**, disetujui saat mengirim paragraf | Siapa pun boleh membagikan dan membuat turunan (termasuk cabang), asal mencantumkan nama penulis, tidak untuk komersial, dan turunannya memakai lisensi yang sama. Tidak ada satu orang pun yang bisa menjual cerita kolaborasi sendirian. |
| Solo | Default **semua hak dilindungi**. Penulis boleh memilih CC kalau mau. | Tulisan sepenuhnya milik penulis, termasuk untuk langganan berbayar. |

- Penanda penulis di setiap paragraf sudah memenuhi syarat atribusi (BY).
- Naratia mendapat izin terpisah lewat syarat layanan: izin non-eksklusif untuk menampilkan dan menyusun paragraf di dalam aplikasi. Syarat NC hanya mengikat pihak luar, bukan operasional Naratia.
- Lisensi CC tidak bisa ditarik. Kalau penulis menghapus akun, paragrafnya tetap ada di cerita (namanya boleh disamarkan), jadi cerita kolaborasi tidak bolong. Hak moral penulis untuk diakui tetap berlaku.
- Ini belum nasihat hukum. Cek ke ahli hukum sebelum monetisasi diluncurkan.

### Pemegang estafet

- **Pemegang estafet** adalah penulis paragraf pemenang terakhir. Haknya hanya berlaku untuk **satu ronde berikutnya**, lalu pindah ke pemenang ronde itu.
- Hak 1, **durasi ronde**, pilih preset: Kilat (1 jam), Normal (24 jam), Panjang (3 hari). Pemenang ronde yang lebih pendek mendapat pengali tinta lebih besar `[TBD]`. Default kalau dia tidak memilih: Normal.
- Hak 2, **constraint ronde** (opsional), pilih satu dari menu preset, bukan teks bebas. Contoh: tanpa dialog, dari POV tokoh lain, maks 1 tokoh baru, harus ada flashback. Syaratnya, dia sudah punya ≥ 3 paragraf diterima di cerita ini `[TBD]`, supaya tidak terkesan "siapa nih ngatur-ngatur". Kandidat yang melanggar constraint bisa digugat lewat Continuity Cop.

### Bab & panjang

- Panjang paragraf: 300–1000 karakter `[TBD]`.
- Cerita dibagi menjadi **bab** berisi sekitar 20 paragraf `[TBD]`. Di akhir bab, pembaca voting **lanjut atau tamat**. Cerita boleh tidak pernah tamat.
- Cara cerita berakhir: voting "tamat" di akhir bab, atau "tidur" karena tidak aktif. Cerita yang tidur bisa diadopsi lagi.

## 3. Threads (benang cerita)

Elemen yang menggantung di cerita: benda, tokoh, janji, atau pertanyaan yang belum terjawab.

**Siklus hidup:** `terbuka → disentuh → ditutup`

- **Membuka thread.** Saat mengirim paragraf, penulis boleh menandai frasa di paragrafnya sebagai thread baru. **Semua pembaca** juga boleh mengusulkan thread dari paragraf mana pun dengan melampirkan kartu kutipan (§5).
- **Supaya chaos-nya terkendali:**
  - Mengusulkan thread ada biayanya, dan pengusul baru dibayar kalau thread-nya diambil orang. Jadi spam tidak menguntungkan.
  - Usulan yang kutipannya tumpang tindih dengan thread yang sudah ada digabung otomatis.
  - Pembaca bisa mendukung usulan (+1). Papan thread disortir berdasarkan dukungan dan tingkat basi.
  - Usulan yang tidak pernah disentuh akan kedaluwarsa setelah `[TBD]` paragraf.
- **Menyentuh thread.** Paragraf baru mengklaim "mengambil thread X" dengan melampirkan kartu kutipan asal thread itu.
- **Menutup thread.** Paragraf mengklaim menyelesaikan thread X.
- **Tingkat basi** = jumlah paragraf sejak thread terakhir disentuh. Makin basi, makin besar bonus untuk mengambilnya.

**Skor (draft):**

| Aksi | Hadiah |
|---|---|
| Mengambil thread biasa | +5 |
| Mengambil thread basi ≥ 5 paragraf | +15 |
| Mengambil thread lintas bab | +30 |
| Menutup thread | +10 |
| Mengusulkan thread yang kemudian diambil orang lain | +10 (dibayar saat thread diambil) |

Klaim thread palsu (paragraf tidak benar-benar memakai thread itu) bisa dilawan lewat Continuity Cop.

## 4. Continuity Cop (polisi kontinuitas)

Selama ronde berjalan, pembaca boleh mengajukan **keberatan** terhadap kandidat:

1. Pelapor memilih kandidat, menulis alasan satu kalimat, dan melampirkan ≥ 1 kartu kutipan sebagai bukti. Contoh: "Raka sudah mati" + kutipan dari paragraf 12.
2. Penulis yang dituduh boleh membela diri dengan kartu tandingan.
3. Keberatan tampil di sebelah kandidat. Voter memberi putusan **valid / tidak valid**.
4. Kalau tidak ada yang memberi putusan sampai ronde selesai, keberatan tidak hangus. Statusnya menjadi **sengketa**. Kalau kandidatnya tetap menang, sengketa menempel di paragraf itu dan bisa diputus belakangan oleh pembaca mana pun. Tidak ada satu orang pun yang menjadi hakim cadangan.

**Penalti selama ronde berjalan:**

| Hasil | Pelapor | Penulis kandidat |
|---|---|---|
| Valid | Taruhan 10 kembali + hadiah 15 (total +25) | Kandidat didiskualifikasi, tidak dapat pengembalian 5. Penulis boleh **merevisi dan mengirim ulang** selama waktu ronde masih tersisa (bayar tinta lagi). |
| Tidak valid | Taruhan 10 hangus, diberikan ke penulis | Tidak terpengaruh |

**Sengketa yang diputus valid setelah paragraf masuk narasi:**
- Paragrafnya tidak dihapus, karena akan merusak cerita.
- Paragraf diberi tanda **luka kontinuitas**, dan otomatis lahir thread berjenis *plot hole*.
- Penulis yang berhasil menambalnya secara masuk akal di narasi mendapat +40.

Mengajukan keberatan membutuhkan taruhan 10 tinta supaya tidak di-spam.

Keberatan juga bisa dipakai melawan klaim thread palsu.

## 5. Kartu kutipan (sistem bukti)

- Saat membaca, pemain bisa highlight potongan teks di paragraf mana pun. Potongan itu tersimpan sebagai **kartu** di koleksinya.
- Data yang disimpan: `paragraph_id`, offset awal dan akhir, snapshot teks. Tidak ada upload atau screenshot.
- **Nilai kartu** naik kalau paragrafnya jauh ke belakang dan jarang dikutip orang. Jadi membaca jauh ke belakang ada hadiahnya.
- Kartu dipakai untuk: mengklaim, membuka, atau menutup thread; mengajukan atau membela keberatan; melampirkan bukti untuk Penanya (§6).

## 6. Penanya (versi manusia dari AI critic)

- Pembaca boleh menempelkan pertanyaan ke sebuah paragraf, opsional dengan kartu kutipan. Contoh: "Kenapa dia tiba-tiba percaya sama orang asing?"
- Pertanyaan menjadi **utang cerita** yang terlihat di narasi.
- Penulis yang menjawab utang itu di dalam narasi dapat bonus. Jawaban divalidasi oleh si penanya atau voter.
- Utang yang tidak dijawab dalam `[TBD]` paragraf menurunkan skor koherensi cerita.
- Penanya hanya bertanya, tidak memberi solusi. Slot yang sama nanti diisi AI (§9).

## 7. Tinta (ekonomi) — angka v0.3 untuk dicoba

### Tinta dan Jejak dipisah

- **Tinta** adalah alat bayar. Boleh habis, dan memang dibuat untuk dipakai.
- **Jejak** adalah statistik permanen di profil yang tidak bisa dibelanjakan: paragraf diterima, keberatan sah, thread ditutup, luka ditambal, streak. Gengsi dan ranking diambil dari Jejak, bukan dari saldo tinta, supaya orang tidak menimbun tinta.

### Aturan mati

Tinta tidak pernah bisa membeli suara, posisi di ranking, atau jalan pintas melewati syarat membaca.

### Tabel

| Aksi | Tinta |
|---|---|
| Saldo awal | 50 |
| Baca paragraf baru | +2 |
| Memberi suara | +3 |
| Batas gabungan baca + suara | 25 per hari |
| Task harian | +10 |
| Kirim kandidat | −10 |
| Kandidat kalah tanpa keberatan sah | +5 kembali |
| Kandidat menang | +30 × pengali durasi (Kilat 1,5 · Normal 1 · Panjang 0,8) |
| Bonus sprint (selesai < 10 menit) | +5 |
| Ajukan keberatan | −10 (taruhan) |
| Keberatan sah | +25 (taruhan kembali + 15) |
| Keberatan tidak sah | taruhan pindah ke penulis kandidat |
| Usul thread | −3, lalu +10 kalau diambil orang |
| Ambil thread / basi ≥ 5 / lintas bab | +5 / +15 / +30 |
| Tutup thread / tambal luka kontinuitas | +10 / +40 |
| Menjawab utang Penanya | +10 |
| Menulis di cerita solo | gratis, 0 tinta |
| Buat cerita kolaborasi | −40 |
| Bangunkan cerita tidur | −30 |
| Pasang bounty thread | minimal 10, 10% dibakar |
| Buka branch | −150 |
| Tanya AI (nanti, P5) | `[TBD]`, sekaligus jadi rem biaya AI |

### Patokan per hari

| Tipe pemain | v0.2 | v0.3 |
|---|---|---|
| Pembaca aktif (baca sampai batas, memilih, task) | +50 | +35 |
| Penulis rajin (2 kandidat, menang 1 dari 3) | +40 | sekitar +52 |
| Penulis pemula (2 kandidat, kalah semua) | +20 | +35 |

Prinsipnya:
- Menulis tidak boleh lebih merugikan daripada membaca. Penulis pemula yang kalah terus tetap setara dengan pembaca aktif.
- Kandidat yang asal tulis lalu kena keberatan sah tetap rugi penuh, jadi pengembalian 5 tidak bisa di-farm.
- Hadiah dari sistem (dicetak) dibatasi. Hadiah besar sebaiknya dibiayai pemain lewat taruhan dan bounty.
- Indikator kesehatan: rasio tinta dibakar dibanding tinta dicetak per minggu. Inflasi kecil wajar selama pengguna masih sedikit.

### Bounty thread

- Siapa pun boleh menaruh tinta di sebuah thread. Contoh: "50 tinta untuk yang menutup Kunci kuningan".
- 10% dibakar saat dipasang. Sisanya dibayar ke penulis paragraf pemenang yang mengambil atau menutup thread itu, sesuai syarat bounty.
- Bounty bisa ditambah orang lain, jadi thread yang banyak dinanti hadiahnya membesar.
- Kalau thread kedaluwarsa atau cerita tidur, bounty dikembalikan ke pemasang setelah dipotong 10% tadi.
- Gunanya dua: memberi kegunaan pada tinta yang menumpuk, dan memancing cerita sepi hidup lagi.

### Monetisasi (jangka panjang, belum dikerjakan)

Untuk sekarang semua gratis, dan tinta tidak bisa ditukar uang. Arah jangka panjang:
- Pembaca bisa **mengikuti** cerita, penulis, atau thread. Mengikuti selalu gratis.
- **Langganan berbayar hanya untuk cerita solo.** Cerita kolaborasi tidak punya pemilik dan berlisensi non-komersial, jadi tidak bisa dijual.
- Model yang disarankan: **akses lebih awal**. Bab baru eksklusif untuk pelanggan selama `[TBD]` hari, lalu terbuka gratis. Cerita tetap bisa dibaca semua orang, dan pelanggan membayar untuk lebih cepat.
- **Potongan platform: 10%.** Ini angka yang dipakai Patreon (untuk kreator baru sejak Agustus 2025), Substack, dan KaryaKarsa. Biaya payment gateway ditanggung terpisah dan ditampilkan terbuka. Opsi promosi: 5% di tahun pertama untuk penulis awal.
- Pembayaran lewat web, bukan pembelian di dalam aplikasi, supaya tidak kena potongan toko aplikasi (sekitar 30%).
- **Syarat membuka langganan berbasis aktivitas, bukan jumlah pengikut.** Usulan: minimal 1 bab cerita solo (±20 paragraf) sudah terbit gratis, dan akun berumur ≥ 30 hari `[TBD]`. Syarat jumlah pengikut merugikan penulis baru dan memancing orang memalsukan pengikut.
- Uang sungguhan dan tinta tetap terpisah. Uang tidak bisa membeli tinta, suara, atau ranking, supaya aturan mati di atas tetap berlaku.

### Branch

- Dibeli dengan tinta, bukan uang. Monetisasi ditunda.
- Paragraf yang kalah bisa "dihidupkan" menjadi cabang what-if.
- Harga mahal (150), supaya branch terasa spesial.

## 8. Task & streak

Task jenis kuantitas (tetap ada):
- Kontribusi ke cerita mana pun hari ini
- Kontribusi ke cerita bergenre X
- Membuat cerita baru

Task yang butuh membaca (inti latihannya):
- Mengambil thread yang basi ≥ 5 paragraf
- Menutup satu thread
- Menangkap satu inkonsistensi (keberatan valid)
- Menjawab satu utang Penanya
- Menulis dengan constraint: tanpa dialog, dari POV antagonis, atau tanpa trope yang baru dipakai

Streak: menulis, membaca, dan vote. Kombo harian kalau ketiganya dilakukan. Streak dan pencapaian task tercatat di Jejak (§7), bukan sebagai tinta yang bisa dibelanjakan.

## 9. Integritas tulisan (anti-copas AI)

Mencegah 100% tidak mungkin, karena screenshot lalu OCR selalu bisa. Yang dilakukan adalah **menambah friksi dan membuat proses menulis terlihat**:

- Paste diblokir di editor paragraf.
- Copy diblokir di teks cerita. Highlight untuk kartu kutipan tetap jalan.
- **Mode sprint**: begitu editor dibuka, timer `[TBD]` menit berjalan, dengan bonus tinta kalau selesai tepat waktu.
- **Badge proses** ditampilkan, bukan dipakai untuk menuduh: "diketik langsung · 7 menit · 3 revisi".

## 10. AI (layer terakhir)

- Syarat masuk: ekonomi app stabil atau surplus.
- Peran: **analis dan penanya saja**, tidak pernah menulis teks cerita dan tidak pernah memberi solusi. Contoh: "Keputusan ini bertentangan dengan paragraf 8. Kenapa?"
- Masuk ke slot yang sudah ada: Penanya (§6), pemeriksa keberatan (§4), dan mungkin skor penilaian per paragraf.

## 11. Urutan pengerjaan (usulan)

| Fase | Isi |
|---|---|
| P0 | Auth, buat cerita, baca cerita, kirim kandidat, ronde voting dengan aturan tanpa-voter, penanda penulis dan waktu, mode solo |
| P1 | Kartu kutipan, Threads |
| P2 | Continuity Cop, Penanya |
| P3 | Tinta, Jejak, task, streak, bounty thread, branch |
| P4 | Integritas tulisan (sprint, badge proses) |
| P5 | AI penanya dan analis |
| P6 | Ikuti cerita/penulis/thread, langganan berbayar (setelah pengguna cukup banyak) |

Catatan: paste-block cukup murah, jadi bisa ikut di P0.

## 12. Keputusan (20 Nov 2026)

1. Durasi ronde ditentukan pemegang estafet lewat preset. Ronde tidak ditutup lebih awal.
2. Continuity Cop: diskualifikasi + revisi saat ronde berjalan; luka kontinuitas + thread plot hole setelah paragraf masuk narasi.
3. Semua pembaca boleh mengusulkan thread, dengan pengendali chaos di §3.
4. Paragraf 300–1000 karakter. Cerita dibagi per bab.
5. Ekonomi tinta pakai angka awal di §7, di-tuning setelah prototipe dicoba.
6. Cerita berakhir lewat voting "tamat" di akhir bab, atau tidur. Neverending boleh.
7. Pemegang estafet boleh memasang constraint kalau sudah punya ≥ 3 paragraf diterima di cerita itu.
8. Undian dipakai sebagai jalan terakhir saat tidak ada voter.
9. Tinta (alat bayar) dipisah dari Jejak (statistik permanen untuk gengsi dan ranking).
10. Kirim kandidat −10. Kandidat yang kalah tanpa keberatan sah dapat +5 kembali. Baca + suara dibatasi 25 tinta per hari.
11. Bounty thread masuk P3 sebagai pengeluaran utama tinta.
12. Cerita solo gratis tapi tidak menghasilkan tinta. Jangka panjang bisa menghasilkan uang sungguhan lewat langganan, dengan potongan kecil untuk platform.
13. Prototipe alur berpemandu (`prototype/naratia-alur.html`) disetujui. Tampilan visual masih terbuka.
14. Langganan berbayar hanya untuk cerita solo.
15. Cerita kolaborasi berlisensi CC BY-NC-SA 4.0. Cerita solo default semua hak dilindungi.
16. Notifikasi pengikut tentang kandidat ditahan sampai ronde ditutup.

## 13. Pertanyaan terbuka

1. Daftar lengkap constraint preset.
2. Besar pengali tinta per durasi ronde.
3. Ukuran bab: tetap 20 paragraf, atau ditentukan per cerita?
4. Cara mendeteksi "membaca paragraf" untuk tinta. Prototipe memakai: paragraf terlihat ≥ 60% (atau memenuhi separuh layar) selama 0,8 detik. Versi asli butuh waktu lebih lama, sebanding dengan panjang paragraf.
5. Lama masa akses lebih awal untuk pelanggan, dan apakah promosi 5% di tahun pertama dipakai.
6. Pengenalan gaya tulisan: penulis populer mungkin tetap dikenali pengikutnya walau anonim. Pantau dulu, tindak kalau terbukti jadi masalah.
