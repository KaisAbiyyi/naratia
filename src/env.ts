import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => (value ? value : undefined);

export const variables = defineEnvVars({
	PUBLIC_DEV_PANEL: {
		description:
			'Isi "1" untuk menyalakan panel /dev. Hanya untuk lokal dan preview, jangan di production.',
		schema: (value) => value === '1'
	},
	VERCEL_ENV: {
		description: 'Diisi otomatis oleh Vercel: production, preview, atau development.',
		schema: optional
	},
	// Semua akses Supabase terjadi di server (tidak ada supabase-js di bundle klien),
	// jadi kedua nilai ini tidak perlu dikirim ke browser walaupun aman untuk publik.
	PUBLIC_SUPABASE_URL: {
		description: 'URL project Supabase, misalnya https://<ref>.supabase.co.',
		schema: optional
	},
	PUBLIC_SUPABASE_PUBLISHABLE_KEY: {
		description: 'Publishable key Supabase (sb_publishable_...). Aman untuk publik.',
		schema: optional
	},
	DEV_TEST_PASSWORD: {
		description:
			'Password akun uji (kamu_uji, lentera, ombak) untuk panel /dev. Hanya di lokal dan Preview.',
		schema: optional
	}
});
