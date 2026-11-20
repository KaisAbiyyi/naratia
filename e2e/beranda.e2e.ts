import { expect, test } from '@playwright/test';

test.describe('Beranda', () => {
	test('menampilkan ronde, cerita lain, dan tugas', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Naratia' })).toBeVisible();
		await expect(page.getByText('Mercusuar Pulau Garam')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Cerita lain' })).toBeVisible();
		await expect(page.getByText('Baca 5 paragraf baru')).toBeVisible();
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

	test('tombol tema berganti dan tersimpan setelah muat ulang', async ({ page }) => {
		await page.goto('/');
		const html = page.locator('html');
		const toggle = page.getByRole('button', { name: /^Tema:/ });
		await expect(toggle).toHaveAttribute('data-theme-pref', 'system');
		await toggle.click();
		await expect(html).toHaveAttribute('data-theme', 'light');
		await toggle.click();
		await expect(html).toHaveAttribute('data-theme', 'dark');
		await page.reload();
		await expect(html).toHaveAttribute('data-theme', 'dark');
		await expect(toggle).toHaveAttribute('data-theme-pref', 'dark');
		await toggle.click();
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
