import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';

const skipVercelAdapter = process.platform === 'win32' && !process.env.VERCEL && !process.env.CI;

export default defineConfig({
	// Tidak memakai PostCSS. Objek kosong mencegah Vite mencari postcss.config di folder induk.
	css: { postcss: {} },
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Fungsi server di Singapura, dekat pengguna Indonesia dan dekat database Supabase (ap-southeast-1).
			// Di Windows tanpa Developer Mode, adapter Vercel gagal membuat symlink. Build lokal di sana
			// cukup untuk `vite preview`, jadi adapter dilewati. CI (Linux) dan Vercel selalu memakainya.
			adapter: skipVercelAdapter ? undefined : adapter({ runtime: 'nodejs24.x', regions: ['sin1'] })
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
