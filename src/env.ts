import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_DEV_PANEL: {
		description:
			'Isi "1" untuk menyalakan panel /dev. Hanya untuk lokal dan preview, jangan di production.',
		schema: (value) => value === '1'
	},
	VERCEL_ENV: {
		description: 'Diisi otomatis oleh Vercel: production, preview, atau development.',
		schema: (value) => value
	}
});
