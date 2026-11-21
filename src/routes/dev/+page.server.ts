import { error, fail, redirect } from '@sveltejs/kit';
import { DEV_TEST_PASSWORD } from '$app/env/private';
import { formText } from '#lib/auth/validate.ts';
import { parseTestUsername, testEmail } from '#lib/dev/accounts.ts';
import { devPanelEnabled } from '#lib/server/dev-panel.ts';
import type { Actions, PageServerLoad } from './$types';

export type DevTab = 'peta' | 'komponen' | 'akun';
const TABS: readonly DevTab[] = ['peta', 'komponen', 'akun'];

/** Dipanggil di load DAN di setiap action: action SvelteKit tidak lewat gerbang load. */
function assertDevPanel() {
	// Di production (atau tanpa PUBLIC_DEV_PANEL=1) panel ini tidak ada sama sekali.
	if (!devPanelEnabled) error(404, 'Halaman tidak ditemukan');
}

export const load: PageServerLoad = ({ url, setHeaders, locals }) => {
	assertDevPanel();
	setHeaders({ 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'no-store' });

	const requested = url.searchParams.get('tab');
	const tab = TABS.find((t) => t === requested) ?? 'peta';
	return {
		tab,
		accounts: {
			connected: Boolean(locals.supabase),
			passwordSet: Boolean(DEV_TEST_PASSWORD),
			current: locals.viewer?.username ?? locals.viewer?.email ?? null,
			currentIsTest: locals.viewer?.isTestAccount ?? false
		}
	};
};

export const actions: Actions = {
	masuk: async ({ request, locals }) => {
		assertDevPanel();
		const username = parseTestUsername(formText(await request.formData(), 'akun'));
		if (!username) return fail(400, { error: 'Akun uji tidak dikenal.' });
		if (!locals.supabase) return fail(503, { error: 'Server belum terhubung ke database.' });
		if (!DEV_TEST_PASSWORD) {
			return fail(503, { error: 'DEV_TEST_PASSWORD belum diisi di env.' });
		}

		const { error: authError } = await locals.supabase.auth.signInWithPassword({
			email: testEmail(username),
			password: DEV_TEST_PASSWORD
		});
		if (authError) {
			return fail(400, { error: 'Masuk gagal. Akun uji belum dibuat atau password-nya berbeda.' });
		}
		redirect(303, '/');
	},

	reset: async ({ locals }) => {
		assertDevPanel();
		if (!locals.supabase) return fail(503, { error: 'Server belum terhubung ke database.' });
		if (!locals.viewer?.isTestAccount) {
			return fail(403, { error: 'Masuk dulu sebagai akun uji untuk mereset data contoh.' });
		}
		const { error: rpcError } = await locals.supabase.rpc('dev_reset_sample');
		if (rpcError) return fail(400, { error: 'Data contoh belum bisa direset.' });
		return { reset: true };
	}
};
