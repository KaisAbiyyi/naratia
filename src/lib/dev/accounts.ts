/** Akun uji untuk panel /dev. Dibuat oleh private.seed_test_users di database dev. */
export const TEST_ACCOUNTS = [
	{ username: 'kamu_uji', note: 'Akun utama kamu di prototipe' },
	{ username: 'lentera', note: 'Pemegang estafet ronde 7' },
	{ username: 'ombak', note: 'Penulis pembuka cerita' }
] as const;

export type TestUsername = (typeof TEST_ACCOUNTS)[number]['username'];

export const testEmail = (username: TestUsername) => `${username}@naratia.test`;

/** Hanya menerima nama yang ada di daftar. Nilai lain (termasuk dari form yang diubah) ditolak. */
export function parseTestUsername(raw: unknown): TestUsername | null {
	return TEST_ACCOUNTS.find((a) => a.username === raw)?.username ?? null;
}
