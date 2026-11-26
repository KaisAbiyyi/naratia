/**
 * Test keamanan terhadap database dev sungguhan (docs/work-packages.md, WP-02:
 * "test membuktikan pengguna tidak bisa menulis langsung ke tabel paragraf").
 *
 * Test memakai kunci publishable yang sama dengan browser, jadi yang dibuktikan adalah
 * apa yang BISA dilakukan penyerang lewat API publik. Dilewati kalau env belum diisi.
 * Test ini hanya membaca atau mencoba menulis (dan harus ditolak), jadi data tidak berubah.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';
import { beforeAll, describe, expect, it } from 'vitest';

const env = { ...loadEnv('', process.cwd(), ''), ...process.env };
const url = env.PUBLIC_SUPABASE_URL;
const key = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const password = env.DEV_TEST_PASSWORD;

const configured = Boolean(url && key);
const canLogin = configured && Boolean(password);

const WRITE_TABLES = [
	'profiles',
	'stories',
	'chapters',
	'paragraphs',
	'rounds',
	'candidates',
	'votes'
] as const;
const ZERO = '00000000-0000-0000-0000-000000000000';

const newClient = () =>
	createClient(url!, key!, {
		auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
	});

async function signedIn(username: string): Promise<SupabaseClient> {
	const client = newClient();
	const { error } = await client.auth.signInWithPassword({
		email: `${username}@naratia.test`,
		password: password!
	});
	if (error) throw new Error(`Masuk sebagai ${username} gagal: ${error.message}`);
	return client;
}

/** Penolakan bisa berupa galat izin, atau 0 baris terpengaruh (RLS menyaring semuanya). */
async function expectNoWrite(result: PromiseLike<{ error: unknown; data: unknown }>) {
	const { error, data } = await result;
	const rows = Array.isArray(data) ? data.length : 0;
	expect(Boolean(error) || rows === 0).toBe(true);
}

describe.skipIf(!configured)('RLS: tamu (anon)', () => {
	let anon: SupabaseClient;
	beforeAll(() => {
		anon = newClient();
	});

	it('boleh membaca cerita, paragraf, ronde, dan view Beranda', async () => {
		for (const table of ['stories', 'chapters', 'paragraphs', 'rounds', 'profiles']) {
			const { data, error } = await anon.from(table).select('id').limit(1);
			expect(error, table).toBeNull();
			expect(data?.length, table).toBe(1);
		}
		const { data, error } = await anon.from('home_stories').select('slug').limit(5);
		expect(error).toBeNull();
		expect(data?.length).toBeGreaterThan(0);
	});

	it.each(WRITE_TABLES)('tidak bisa INSERT ke %s', async (table) => {
		const { error } = await anon.from(table).insert({ id: ZERO });
		expect(error).not.toBeNull();
	});

	it.each(WRITE_TABLES)('tidak bisa UPDATE atau DELETE di %s', async (table) => {
		await expectNoWrite(anon.from(table).update({ id: ZERO }).eq('id', ZERO).select());
		await expectNoWrite(anon.from(table).delete().eq('id', ZERO).select());
	});

	it('tidak bisa memanggil fungsi tulis atau fungsi dev', async () => {
		expect((await anon.rpc('claim_username', { p_username: 'peretas' })).error).not.toBeNull();
		expect((await anon.rpc('dev_reset_sample')).error).not.toBeNull();
	});

	it('suara bersifat rahasia: tamu tidak melihat satu pun', async () => {
		const { data } = await anon.from('votes').select('*');
		expect(data ?? []).toHaveLength(0);
	});

	it('penulis kandidat anonim: kolom author_id tidak bisa dibaca', async () => {
		const bad = await anon.from('candidates').select('author_id').limit(1);
		expect(bad.error).not.toBeNull();
		const star = await anon.from('candidates').select('*').limit(1);
		expect(star.error).not.toBeNull();
		const ok = await anon.from('candidates').select('id, body, status').limit(5);
		expect(ok.error).toBeNull();
		expect(ok.data?.length).toBeGreaterThan(0);
	});

	it('skema private tidak terekspos lewat API', async () => {
		const { error } = await anon.schema('private').from('app_flags').select('*');
		expect(error).not.toBeNull();
	});
});

describe.skipIf(!canLogin)('RLS: pengguna yang sudah masuk', () => {
	let lentera: SupabaseClient;
	beforeAll(async () => {
		lentera = await signedIn('lentera');
	});

	it('tetap TIDAK bisa menulis langsung ke paragraf, ronde, kandidat, atau suara', async () => {
		const { data: para } = await lentera
			.from('paragraphs')
			.select('id, story_id, chapter_id')
			.limit(1);
		const p = para![0];
		const { data: me } = await lentera.auth.getUser();
		const uid = me.user!.id;

		// Menyelipkan paragraf atas nama sendiri.
		const insert = await lentera.from('paragraphs').insert({
			story_id: p.story_id,
			chapter_id: p.chapter_id,
			idx: 9999,
			author_id: uid,
			body: 'Paragraf selundupan.'
		});
		expect(insert.error).not.toBeNull();

		// Mengubah atau menghapus paragraf milik sendiri.
		await expectNoWrite(
			lentera.from('paragraphs').update({ body: 'diubah' }).eq('author_id', uid).select()
		);
		await expectNoWrite(lentera.from('paragraphs').delete().eq('author_id', uid).select());

		// Memberi suara tanpa lewat fungsi.
		const vote = await lentera
			.from('votes')
			.insert({ round_id: ZERO, voter_id: uid, candidate_id: ZERO });
		expect(vote.error).not.toBeNull();

		// Mengangkat diri jadi pemegang estafet.
		await expectNoWrite(
			lentera.from('rounds').update({ holder_id: uid }).eq('status', 'open').select()
		);
	});

	it('hanya bisa melihat suara sendiri, dan tetap tidak bisa membaca author_id kandidat', async () => {
		const { data } = await lentera.from('votes').select('voter_id');
		const { data: me } = await lentera.auth.getUser();
		for (const row of data ?? []) expect(row.voter_id).toBe(me.user!.id);

		const { error } = await lentera.from('candidates').select('author_id').limit(1);
		expect(error).not.toBeNull();
	});

	it('claim_username menolak nama sistem, nama terpakai, dan format salah', async () => {
		const reserved = await lentera.rpc('claim_username', { p_username: 'admin' });
		expect(reserved.error?.message).toContain('reserved_username');
		const taken = await lentera.rpc('claim_username', { p_username: 'ombak' });
		expect(taken.error?.message).toContain('username_taken');
		const bad = await lentera.rpc('claim_username', { p_username: 'Nama Salah!' });
		expect(bad.error?.message).toContain('invalid_username');
	});

	it('akun uji punya flag test_account di JWT, dan data profilnya cocok', async () => {
		const { data } = await lentera.auth.getUser();
		expect(data.user?.app_metadata.test_account).toBe(true);
		const { data: profile } = await lentera
			.from('profiles')
			.select('username')
			.eq('id', data.user!.id)
			.single();
		expect(profile?.username).toBe('lentera');
	});
});
