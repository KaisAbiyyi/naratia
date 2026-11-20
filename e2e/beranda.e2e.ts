import { expect, test, type Page } from '@playwright/test';

const openProfile = async (page: Page) => {
	await page.getByRole('button', { name: /^Profil kamu_uji/ }).click();
	const menu = page.locator('[popover]:popover-open');
	await expect(menu).toBeVisible();
	return menu;
};

test.describe('Beranda', () => {
	test('menampilkan ronde dan cerita lain, tanpa daftar tugas', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Naratia' })).toBeVisible();
		await expect(page.getByText('Mercusuar Pulau Garam')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Cerita lain' })).toBeVisible();
		await expect(page.getByText('Baca 5 paragraf baru')).toBeHidden();
	});

	test('mengetuk kartu ronde menampilkan toast', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /Mercusuar Pulau Garam/ }).click();
		await expect(page.getByRole('status')).toContainText('sedang disiapkan');
	});

	test('chip tinta membuka sheet yang bisa ditutup dengan Esc', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /^Tinta 50/ }).click();
		const sheet = page.getByRole('dialog', { name: 'Tinta kamu: 50' });
		await expect(sheet).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(sheet).toBeHidden();
	});

	test('menu profil berisi tugas hari ini dan tertutup dengan Esc', async ({ page }) => {
		await page.goto('/');
		const avatar = page.getByRole('button', { name: /^Profil kamu_uji/ });
		await expect(avatar).toHaveAccessibleName(/4 tugas hari ini belum selesai/);
		const menu = await openProfile(page);
		await expect(menu.getByText('Baca 5 paragraf baru')).toBeVisible();
		await expect(menu.getByText('Hari ke-3 beruntun menulis')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(menu).toBeHidden();
	});

	test('pilihan tema di menu profil berlaku dan tersimpan', async ({ page }) => {
		await page.goto('/');
		const html = page.locator('html');
		let menu = await openProfile(page);
		await expect(menu.getByRole('radio', { name: 'Sistem' })).toBeChecked();
		await menu.getByText('Gelap', { exact: true }).click();
		await expect(html).toHaveAttribute('data-theme', 'dark');
		await page.reload();
		await expect(html).toHaveAttribute('data-theme', 'dark');
		menu = await openProfile(page);
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
