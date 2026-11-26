/**
 * Aturan navigasi terkait login. Fungsi murni supaya mudah dites.
 */

/** Rute yang tetap bisa dibuka walaupun username belum dipilih. */
const ONBOARDING_EXEMPT = ['/mulai', '/auth/', '/keluar', '/dev'];

export function needsOnboarding(
	pathname: string,
	hasUsername: boolean,
	loggedIn: boolean
): boolean {
	if (!loggedIn || hasUsername) return false;
	return !ONBOARDING_EXEMPT.some((p) => pathname === p || pathname.startsWith(p));
}

/**
 * Tujuan setelah login. Hanya path relatif di situs ini yang diterima, supaya parameter
 * `next` tidak bisa dipakai untuk mengalihkan ke situs lain (open redirect).
 */
export function safeNext(next: string | null | undefined, fallback = '/'): string {
	if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
		return fallback;
	}
	return next;
}
