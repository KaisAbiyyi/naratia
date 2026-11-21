import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from 'vite';

// Muat .env lokal supaya test (dan server preview yang dijalankan Playwright) melihat env yang sama
// dengan `pnpm dev`. Nilai yang sudah ada di environment (misalnya dari CI) tidak ditimpa.
for (const [key, value] of Object.entries(loadEnv('', process.cwd(), ''))) {
	process.env[key] ??= value;
}

export default defineConfig({
	testDir: 'e2e',
	testMatch: '**/*.e2e.{ts,js}',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['github'], ['list']] : 'list',
	use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
	projects: [
		{ name: 'hp', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
		{
			name: 'desktop',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } }
		}
	],
	webServer: {
		command: 'pnpm run build && pnpm run preview --port 4173 --strictPort',
		port: 4173,
		reuseExistingServer: !process.env.CI,
		env: { ...(process.env as Record<string, string>), PUBLIC_DEV_PANEL: '1' }
	}
});
