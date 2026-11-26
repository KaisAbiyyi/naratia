-- WP-02 · Fungsi inti, hak akses, view Beranda, dan alat data contoh.
-- Prinsip (docs/tech-plan.md §3): klien hanya membaca. Semua tulis lewat fungsi security definer.

-- ---------------------------------------------------------------------------
-- Skema privat: tidak diekspos lewat API (PostgREST hanya mengekspos public).
-- ---------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.app_flags (
	key text primary key,
	value boolean not null
);

-- ---------------------------------------------------------------------------
-- Relasi yang saling merujuk: pemenang ronde -> kandidat.
-- ---------------------------------------------------------------------------
alter table public.rounds
	add constraint rounds_winner_candidate_fk
	foreign key (winner_candidate_id) references public.candidates (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Hak akses. RLS sudah menolak tulis karena tidak ada policy tulis; hak tabel
-- dicabut juga sebagai lapis kedua.
-- ---------------------------------------------------------------------------
revoke insert, update, delete, truncate on
	public.profiles, public.stories, public.chapters, public.paragraphs,
	public.rounds, public.candidates, public.votes
	from anon, authenticated;

-- Penulis kandidat anonim selama ronde berjalan: kolom author_id tidak bisa dibaca klien.
-- Nama penulis dibuka lewat fungsi setelah ronde ditutup (WP-04).
revoke select on public.candidates from anon, authenticated;
grant select (id, round_id, body, process_json, thread_claims, status, created_at)
	on public.candidates to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Onboarding: pilih atau ganti username.
-- ---------------------------------------------------------------------------
create or replace function public.claim_username(p_username text)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_uid uuid := auth.uid();
	v_name text := lower(btrim(coalesce(p_username, '')));
	v_row public.profiles;
begin
	if v_uid is null then
		raise exception 'not_authenticated' using errcode = '28000';
	end if;
	if v_name !~ '^[a-z0-9_]{3,20}$' then
		raise exception 'invalid_username' using errcode = '22023';
	end if;
	if v_name in ('admin', 'naratia', 'moderator', 'sistem', 'dev', 'tamu') then
		raise exception 'reserved_username' using errcode = '22023';
	end if;

	begin
		insert into public.profiles (id, username)
		values (v_uid, v_name)
		on conflict (id) do update set username = excluded.username
		returning * into v_row;
	exception when unique_violation then
		raise exception 'username_taken' using errcode = '23505';
	end;

	return v_row;
end;
$$;

revoke execute on function public.claim_username(text) from public, anon;
grant execute on function public.claim_username(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Beranda: satu query untuk semua kartu cerita (tidak tumbuh dengan jumlah paragraf).
-- Jumlah paragraf dan kandidat dibaca dari kolom penghitung, bukan COUNT.
-- ---------------------------------------------------------------------------
create view public.home_stories
with (security_invoker = true)
as
select
	s.id,
	s.slug,
	s.title,
	s.genre,
	s.mode,
	s.status,
	s.paragraph_count,
	s.updated_at,
	r.number as round_number,
	r.closes_at as round_closes_at,
	r.constraint_key as round_constraint_key,
	r.candidate_count as round_candidate_count,
	c.status as chapter_status
from public.stories s
left join public.rounds r
	on r.story_id = s.id and r.status = 'open'
left join lateral (
	select ch.status
	from public.chapters ch
	where ch.story_id = s.id
	order by ch.number desc
	limit 1
) c on true;

grant select on public.home_stories to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Data contoh. Hanya bisa dijalankan kalau private.app_flags('dev_tools') = true,
-- yang hanya diisi di database dev. Akun uji dibuat lewat private.seed_test_users,
-- yang tidak bisa dipanggil klien.
-- ---------------------------------------------------------------------------
create or replace function private.seed_test_users(p_password text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_name text;
	v_email text;
	v_id uuid;
begin
	if coalesce(length(p_password), 0) < 12 then
		raise exception 'password akun uji minimal 12 karakter';
	end if;

	foreach v_name in array array['kamu_uji', 'lentera', 'ombak'] loop
		v_email := v_name || '@naratia.test';
		select u.id into v_id from auth.users u where u.email = v_email;

		if v_id is null then
			v_id := gen_random_uuid();
			insert into auth.users (
				instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
				raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
				confirmation_token, email_change, email_change_token_new, recovery_token
			) values (
				'00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated',
				v_email, extensions.crypt(p_password, extensions.gen_salt('bf')), now(),
				'{"provider":"email","providers":["email"],"test_account":true}'::jsonb, '{}'::jsonb,
				now(), now(), '', '', '', ''
			);
			insert into auth.identities (
				id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
			) values (
				gen_random_uuid(), v_id, v_id::text,
				jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true),
				'email', now(), now(), now()
			);
		else
			update auth.users
			set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')),
				updated_at = now()
			where id = v_id;
		end if;

		insert into public.profiles (id, username)
		values (v_id, v_name)
		on conflict (id) do update set username = excluded.username;
	end loop;
end;
$$;

revoke all on function private.seed_test_users(text) from public, anon, authenticated;

create or replace function private.seed_sample()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_kamu uuid;
	v_lentera uuid;
	v_ombak uuid;
	v_story uuid;
	v_chapter uuid;
	v_round uuid;
begin
	select id into v_kamu from public.profiles where username = 'kamu_uji';
	select id into v_lentera from public.profiles where username = 'lentera';
	select id into v_ombak from public.profiles where username = 'ombak';
	if v_kamu is null or v_lentera is null or v_ombak is null then
		raise exception 'akun uji belum ada, jalankan private.seed_test_users dulu';
	end if;

	-- Hanya cerita contoh yang dihapus. Cerita buatan pengguna tidak disentuh.
	delete from public.stories
	where slug in ('mercusuar-pulau-garam', 'pasar-malam-terakhir', 'kota-yang-lupa-hujan');

	-- 1. Mercusuar Pulau Garam: 6 paragraf dari prototipe, ronde 7 terbuka dengan 2 kandidat.
	insert into public.stories (slug, title, genre, mode, license, created_by, paragraph_count, updated_at)
	values ('mercusuar-pulau-garam', 'Mercusuar Pulau Garam', 'Misteri', 'collab', 'CC BY-NC-SA 4.0',
		v_ombak, 6, now() - interval '3 hours')
	returning id into v_story;

	insert into public.chapters (story_id, number) values (v_story, 1) returning id into v_chapter;

	insert into public.paragraphs (story_id, chapter_id, idx, author_id, body, created_at) values
	(v_story, v_chapter, 1, v_ombak,
		'Raka tiba di Pulau Garam dengan kapal pos terakhir musim itu. Penjaga mercusuar sudah tiga minggu hilang, dan satu-satunya yang ia tinggalkan di meja hanyalah sebuah kunci kuningan yang dingin, seperti baru diangkat dari laut. Tidak ada satu pun pintu di rumah itu yang cocok dengan kunci tersebut.',
		now() - interval '6 days'),
	(v_story, v_chapter, 2, v_lentera,
		'Warga pulau tidak mau bicara banyak. Mereka hanya bilang lampu mercusuar masih menyala setiap Kamis malam, padahal tidak ada seorang pun yang naik ke atas. Raka mencatatnya di buku kecil, lalu menggarisbawahinya dua kali.',
		now() - interval '5 days'),
	(v_story, v_chapter, 3, v_ombak,
		'Di dapur, Raka menemukan foto lama: sang penjaga berdiri di samping seorang gadis kecil. Di baliknya tertulis dengan tinta pudar: Sekar, ulang tahun ketujuh. Ibu pemilik warung kemudian bercerita bahwa Sekar adalah putri tunggal sang penjaga, dan ia meninggalkan pulau sepuluh tahun lalu.',
		now() - interval '4 days'),
	(v_story, v_chapter, 4, v_lentera,
		'Kamis tiba, dan Raka menunggu di bawah menara sejak senja. Tepat tengah malam, lampu di puncak menyala sendiri, berputar pelan, lalu padam lagi. Ketika ia berlari ke tangga, pintu menuju ruang lampu ternyata terkunci dari dalam.',
		now() - interval '3 days'),
	(v_story, v_chapter, 5, v_ombak,
		'Pagi harinya ia memeriksa pintu itu. Lubang kuncinya baru dan mengilap, sangat berbeda dengan engselnya yang sudah berkarat. Di lantai depan pintu ada jejak pasir basah yang mengarah ke tebing utara.',
		now() - interval '2 days'),
	(v_story, v_chapter, 6, v_lentera,
		'Jejak itu berhenti di bibir tebing, tepat di atas batu-batu hitam yang dihantam ombak. Raka hampir berbalik ketika melihat sesuatu tersangkut di semak: sebuah syal merah yang masih basah. Di ujungnya, sebuah huruf S dijahit dengan benang putih.',
		now() - interval '1 day');

	insert into public.rounds (story_id, number, holder_id, preset, constraint_key, opens_at, closes_at, candidate_count)
	values (v_story, 7, v_lentera, 'normal', 'tanpa_dialog', now() - interval '3 hours',
		now() + interval '21 hours', 2)
	returning id into v_round;

	insert into public.candidates (round_id, author_id, body, created_at) values
	(v_round, v_lentera,
		'Raka memungut syal itu. Baunya asin, tapi ada bau lain yang ia kenal: minyak tanah, sama persis dengan bau di tangga mercusuar. Ia menatap menara dari bibir tebing dan untuk pertama kalinya bertanya-tanya apakah yang menyalakan lampu setiap Kamis bukan hantu, melainkan seseorang yang tidak ingin ditemukan.',
		now() - interval '2 hours'),
	(v_round, v_ombak,
		'Raka teringat cerita ibu pemilik warung tentang Seruni, putri tunggal sang penjaga yang pergi sepuluh tahun lalu. Huruf S di syal itu pasti miliknya. Ia melipat syal itu hati-hati, memasukkannya ke saku jaket, lalu bergegas kembali ke rumah penjaga untuk mencari petunjuk ke mana Seruni pergi.',
		now() - interval '1 hour');

	-- 2. Pasar Malam Terakhir: bab pertama selesai, pembaca sedang voting lanjut/tamat.
	insert into public.stories (slug, title, genre, mode, license, created_by, chapter_size, paragraph_count, updated_at)
	values ('pasar-malam-terakhir', 'Pasar Malam Terakhir', 'Drama', 'collab', 'CC BY-NC-SA 4.0',
		v_lentera, 3, 3, now() - interval '1 day')
	returning id into v_story;

	insert into public.chapters (story_id, number, status) values (v_story, 1, 'voting') returning id into v_chapter;

	insert into public.paragraphs (story_id, chapter_id, idx, author_id, body, created_at) values
	(v_story, v_chapter, 1, v_lentera,
		'Pasar malam di lapangan kecamatan akan ditutup selamanya setelah malam ini. Bu Ratmi tetap menyalakan lampu petromaks di kios gulali, walaupun sejak sore belum ada satu pun pembeli yang mampir.',
		now() - interval '3 days'),
	(v_story, v_chapter, 2, v_ombak,
		'Menjelang pukul sepuluh, seorang anak laki-laki berdiri lama di depan kios. Ia tidak membawa uang, hanya sebuah karcis komidi putar yang sudah lusuh, bertanggal dua puluh tahun lalu.',
		now() - interval '2 days'),
	(v_story, v_chapter, 3, v_lentera,
		'Bu Ratmi mengenali tulisan tangan di balik karcis itu. Tulisan suaminya, yang dulu menjaga komidi putar sebelum menghilang pada malam penutupan pasar yang pertama.',
		now() - interval '1 day');

	-- 3. Kota yang Lupa Hujan: ronde 2 terbuka tapi belum ada kandidat.
	insert into public.stories (slug, title, genre, mode, license, created_by, paragraph_count, updated_at)
	values ('kota-yang-lupa-hujan', 'Kota yang Lupa Hujan', 'Fantasi', 'collab', 'CC BY-NC-SA 4.0',
		v_ombak, 1, now() - interval '2 days')
	returning id into v_story;

	insert into public.chapters (story_id, number) values (v_story, 1) returning id into v_chapter;

	insert into public.paragraphs (story_id, chapter_id, idx, author_id, body, created_at) values
	(v_story, v_chapter, 1, v_ombak,
		'Sudah tujuh tahun hujan tidak turun di Kota Saga. Anak-anak yang lahir setelahnya hanya mengenal hujan dari lagu, dan para tetua mulai lupa bunyinya. Suatu pagi, Laras menemukan payung basah tersandar di depan pintu rumahnya.',
		now() - interval '2 days');

	insert into public.rounds (story_id, number, holder_id, preset, opens_at, closes_at)
	values (v_story, 2, v_ombak, 'panjang', now() - interval '1 day', now() + interval '2 days');
end;
$$;

revoke all on function private.seed_sample() from public, anon, authenticated;

-- Dipanggil tombol "Reset data contoh" di panel /dev.
create or replace function public.dev_reset_sample()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
	if not coalesce((select f.value from private.app_flags f where f.key = 'dev_tools'), false) then
		raise exception 'dev_tools_disabled' using errcode = '42501';
	end if;
	perform private.seed_sample();
end;
$$;

revoke execute on function public.dev_reset_sample() from public;
grant execute on function public.dev_reset_sample() to anon, authenticated;
