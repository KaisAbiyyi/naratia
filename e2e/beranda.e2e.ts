import { expect, test, type Page } from '@playwright/test';

const hasDatabase = Boolean(
	process.env.PUBLIC_SUPABASE_URL && process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const openGuestMenu = async (page: Page) => {
	await page.getByRole('button', { name: /^Menu tamu/ }).click();
	const menu = page.locator('[popover]:popover-open');
	await expect(menu).toBeVisible();
	return menu;
};

test.describe('Beranda (tamu)', () => {
	test('menampilkan ronde dan cerita lain dari database', async ({ page }) => {
		test.skip(!hasDatabase, 'Butuh env Supabase.');
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Naratia' })).toBeVisible();

		const round = page.getByRole('button', { name: /Mercusuar Pulau Garam/ });
		await expect(round).toBeVisible();
		await expect(round).toContainText('Ronde 7 · menulis ¶7 · 2 kandidat');
		await expect(round).toContainText('Constraint: Tanpa dialog');

		await expect(
			page.getByRole('button', { name: /Pasar Malam Terakhir.*voting akhir bab/ })
		).toBeVisible();
		await expect(
			page.getByRole('button', { name: /Kota yang Lupa Hujan.*ronde sepi/ })
		).toBeVisible();
		await expect(page.getByText('Baca 5 paragraf baru')).toBeHidden();
	});

	test('mengetuk kartu ronde menampilkan toast', async ({ page }) => {
		test.skip(!hasDatabase, 'Butuh env Supabase.');
		await page.goto('/');
		await page.getByRole('button', { name: /Mercusuar Pulau Garam/ }).click();
		await expect(page.getByRole('status')).toContainText('sedang disiapkan');
	});

	test('app bar tamu: tanpa chip tinta dan kartu, dengan menu masuk', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('button', { name: /^Tinta/ })).toBeHidden();
		const menu = await openGuestMenu(page);
		await expect(menu.getByText('Kamu belum masuk')).toBeVisible();
		await expect(menu.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/masuk');
		await page.keyboard.press('Escape');
		await expect(menu).toBeHidden();
	});

	test('pilihan tema di menu berlaku dan tersimpan', async ({ page }) => {
		await page.goto('/');
		const html = page.locator('html');
		let menu = await openGuestMenu(page);
		await expect(menu.getByRole('radio', { name: 'Sistem' })).toBeChecked();
		await menu.getByText('Gelap', { exact: true }).click();
		await expect(html).toHaveAttribute('data-theme', 'dark');
		await page.reload();
		await expect(html).toHaveAttribute('data-theme', 'dark');
		menu = await openGuestMenu(page);
		await expect(menu.getByRole('radio', { name: 'Gelap' })).toBeChecked();
		await menu.getByText('Sistem', { exact: true }).click();
		await expect(html).not.toHaveAttribute('data-theme', /.+/);
	});

	test('tidak ada gulir horizontal di HP', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
});
