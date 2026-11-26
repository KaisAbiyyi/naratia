import { expect, test } from '@playwright/test';

// Server e2e berjalan dengan PUBLIC_DEV_PANEL=1 (lihat playwright.config.ts).
test.describe('Panel /dev', () => {
	test('Peta WP menampilkan WP terakhir selesai, sekarang, dan berikutnya', async ({ page }) => {
		await page.goto('/dev');
		await expect(page.getByRole('heading', { name: 'Panel dev' })).toBeVisible();
		await expect(page.getByRole('tab', { name: /Peta WP/ })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect(page.getByText('1 dari 13 WP selesai.')).toBeVisible();
		await expect(page.getByText('WP-01 · Fondasi SvelteKit & deploy')).toBeVisible();
		await expect(page.getByText('WP-02 · Supabase, auth, skema inti & data contoh')).toBeVisible();
		await expect(page.getByText('WP-03 · Baca & tulis cerita (solo)')).toBeVisible();
	});

	test('tab bisa dibuka lewat tautan dan keyboard, dan URL ikut berubah', async ({ page }) => {
		await page.goto('/dev?tab=komponen');
		await expect(page.getByRole('tab', { name: 'Komponen' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await page.getByRole('button', { name: 'Buka sheet' }).click();
		await expect(page.getByRole('dialog', { name: 'Contoh sheet' })).toBeVisible();
		await page.getByRole('button', { name: 'Mengerti' }).click();

		await page.getByRole('tab', { name: 'Komponen' }).focus();
		await page.keyboard.press('ArrowLeft');
		await expect(page.getByRole('tab', { name: 'Akun uji' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect(page).toHaveURL(/tab=akun/);
		await page.keyboard.press('Home');
		await expect(page.getByRole('tab', { name: /Peta WP/ })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect(page).toHaveURL(/\/dev$/);
	});
});
