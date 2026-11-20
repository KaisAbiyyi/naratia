import { defineConfig, devices } from '@playwright/test';

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
		env: { PUBLIC_DEV_PANEL: '1' }
	}
});
