# Supabase: migrasi, data contoh, dan akun uji

Database dev: project **naratia-dev** (`mpufaqbuirilrhrhbcmo`, Singapura). Saat ini satu database ini
dipakai lokal, Preview, dan Production. Database Production terpisah dibuat sebelum ada pengguna lain.

## Prinsip

- **Klien hanya membaca.** RLS menyala di semua tabel, tidak ada policy tulis, dan hak INSERT/UPDATE/DELETE
  dicabut dari `anon` dan `authenticated`. Semua tulis lewat fungsi `security definer` yang memeriksa
  `auth.uid()` dan aturan game. Dibuktikan oleh `src/lib/server/db/rls.integration.spec.ts`.
- **Penulis kandidat anonim.** `candidates.author_id` tidak bisa dibaca klien. Suara (`votes`) hanya terlihat
  oleh pemiliknya sendiri.
- **Skema `private`** tidak diekspos API. Isinya flag dev dan fungsi seed.
- Aplikasi tidak punya koneksi Postgres langsung (tidak ada `DATABASE_URL`). Semuanya lewat `supabase-js`
  dengan kunci publishable, sebagai pengguna yang sedang masuk.

## Alur migrasi

1. Ubah skema di `src/lib/server/db/schema.ts`, lalu `pnpm db:generate`. Drizzle menulis SQL ke `supabase/migrations`.
2. Aturan game (fungsi, view, grant) ditulis sebagai migrasi custom:
   `pnpm exec drizzle-kit generate --custom --name <nama>`, lalu isi file SQL-nya.
3. Terapkan ke database lewat Supabase MCP (`apply_migration`) atau SQL Editor di dashboard.
4. Server mencatat versi sendiri. **Ganti nama file migrasi** (dan `meta/_journal.json` + snapshot-nya)
   supaya awalannya sama dengan versi yang tercatat di server (`list_migrations`).
5. Perbarui `src/lib/supabase/database.types.ts` (Supabase MCP `generate_typescript_types`).
6. Jalankan `get_advisors` (security) dan pastikan tidak ada temuan baru.

## Akun uji dan data contoh

Tiga akun uji (`kamu_uji`, `lentera`, `ombak`, email `<nama>@naratia.test`) memakai satu password acak yang
disimpan sebagai `DEV_TEST_PASSWORD` (`.env`, Vercel Preview, GitHub secret). Tidak pernah di-commit.

```sql
-- Buat atau perbarui akun uji, lalu isi data contoh (idempoten).
insert into private.app_flags (key, value) values ('dev_tools', true)
  on conflict (key) do update set value = true;
select private.seed_test_users('<DEV_TEST_PASSWORD>');
select private.seed_sample();
```

Panel `/dev` (tab **Akun uji**) berisi tombol masuk sebagai akun uji dan **Reset data contoh**. Reset hanya
berjalan kalau `dev_tools` menyala di database dan pemanggilnya akun uji (`app_metadata.test_account`).
