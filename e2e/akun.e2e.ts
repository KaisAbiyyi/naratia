import { expect, test, type Page } from '@playwright/test';

const hasLogin = Boolean(
	process.env.PUBLIC_SUPABASE_URL &&
	process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
	process.env.DEV_TEST_PASSWORD
);

/** Masuk lewat tombol akun uji di panel /dev (sama seperti yang dilakukan pemilik). */
async function loginAs(page: Page, username: string) {
	await page.goto('/dev?tab=akun');
	await page.getByRole('button', { name: new RegExp(`^${username}`) }).click();
	await expect(page).toHaveURL('/');
	await expect(page.getByRole('button', { name: new RegExp(`^Profil ${username}`) })).toBeVisible();
}

test.describe('Halaman masuk dan akses tamu', () => {
	test('halaman masuk menampilkan form email dan catatan lisensi', async ({ page }) => {
		await page.goto('/masuk');
		await expect(page.getByRole('heading', { name: 'Masuk ke Naratia' })).toBeVisible();
		await expect(page.getByLabel('Email')).toBeVisible();
		await expect(page.getByRole('button', { name: /tautan masuk/ })).toBeVisible();
		await expect(page.getByText('CC BY-NC-SA 4.0')).toBeVisible();
	});

	test('tamu yang membuka /profil atau /mulai diarahkan ke halaman masuk', async ({ page }) => {
		await page.goto('/profil');
		await expect(page).toHaveURL(/\/masuk\?next=%2Fprofil/);
		await page.goto('/mulai');
		await expect(page).toHaveURL(/\/masuk/);
	});

	test('parameter next ke situs lain diabaikan', async ({ page }) => {
		await page.goto('/masuk?next=https://jahat.example/ambil');
		await expect(page.locator('input[name="next"]')).toHaveValue('/');
		await page.goto('/masuk?next=//jahat.example');
		await expect(page.locator('input[name="next"]')).toHaveValue('/');
	});

	test('tab Akun uji di /dev tampil dengan tiga akun', async ({ page }) => {
		await page.goto('/dev?tab=akun');
		await expect(page.getByRole('tab', { name: 'Akun uji' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		for (const name of ['kamu_uji', 'lentera', 'ombak']) {
			await expect(page.getByRole('button', { name: new RegExp(`^${name}`) })).toBeVisible();
		}
	});
});

test.describe('Akun uji (butuh DEV_TEST_PASSWORD)', () => {
	// Sesi disimpan di cookie per konteks browser, jadi test ini aman berjalan paralel.
	test.skip(!hasLogin, 'Butuh env Supabase dan DEV_TEST_PASSWORD.');

	test('masuk sebagai lentera, lihat menu profil, lalu keluar', async ({ page }) => {
		await loginAs(page, 'lentera');

		await page.getByRole('button', { name: /^Profil lentera/ }).click();
		const menu = page.locator('[popover]:popover-open');
		await expect(menu.getByText('Hari ke-3 beruntun menulis')).toBeVisible();
		await expect(menu.getByText('Baca 5 paragraf baru')).toBeVisible();
		await menu.getByRole('link', { name: 'Profil' }).click();

		await expect(page).toHaveURL('/profil');
		// Menu menutup sendiri setelah pindah halaman.
		await expect(menu).toBeHidden();
		await expect(page.getByRole('heading', { name: 'lentera' })).toBeVisible();
		await expect(page.getByText('lentera@naratia.test')).toBeVisible();

		await page.getByRole('button', { name: 'Keluar' }).click();
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('button', { name: /^Menu tamu/ })).toBeVisible();
	});

	test('pengguna yang sudah masuk tidak melihat halaman masuk lagi', async ({ page }) => {
		await loginAs(page, 'ombak');
		await page.goto('/masuk');
		await expect(page).toHaveURL('/');
	});

	test('chip tinta dan kartu muncul setelah masuk, sheet tinta bisa ditutup dengan Esc', async ({
		page
	}) => {
		await loginAs(page, 'kamu_uji');
		await page.getByRole('button', { name: /^Tinta 50/ }).click();
		const sheet = page.getByRole('dialog', { name: 'Tinta kamu: 50' });
		await expect(sheet).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(sheet).toBeHidden();
	});

	test('reset data contoh hanya aktif untuk akun uji dan mengembalikan tiga cerita', async ({
		page
	}, testInfo) => {
		// Satu proyek saja yang mereset, supaya dua browser tidak saling menimpa data.
		test.skip(testInfo.project.name !== 'desktop', 'Hanya dijalankan di proyek desktop.');
		await page.goto('/dev?tab=akun');
		await expect(page.getByRole('button', { name: 'Reset data contoh' })).toBeDisabled();

		await loginAs(page, 'kamu_uji');
		await page.goto('/dev?tab=akun');
		await page.getByRole('button', { name: 'Reset data contoh' }).click();
		await expect(page.getByRole('status').filter({ hasText: 'sudah direset' })).toBeVisible();

		await page.goto('/');
		await expect(page.getByRole('button', { name: /Mercusuar Pulau Garam/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /Pasar Malam Terakhir/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /Kota yang Lupa Hujan/ })).toBeVisible();
	});
});
