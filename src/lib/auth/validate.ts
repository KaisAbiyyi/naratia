/** Validasi input akun. Dipakai di server sebelum memanggil Supabase. */

export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const RESERVED = new Set(['admin', 'naratia', 'moderator', 'sistem', 'dev', 'tamu']);

export function normalizeUsername(raw: unknown): string {
	return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

/** Pesan galat dalam Bahasa Indonesia, atau `null` kalau valid. */
export function usernameError(name: string): string | null {
	if (name.length < 3) return 'Minimal 3 karakter.';
	if (name.length > 20) return 'Maksimal 20 karakter.';
	if (!USERNAME_PATTERN.test(name)) return 'Hanya huruf kecil, angka, dan garis bawah (_).';
	if (RESERVED.has(name)) return 'Nama ini dipakai sistem. Pilih nama lain.';
	return null;
}

/** Terjemahkan galat dari fungsi claim_username. */
export function claimUsernameMessage(dbMessage: string | undefined): string {
	if (dbMessage?.includes('username_taken')) return 'Nama ini sudah dipakai orang lain.';
	if (dbMessage?.includes('reserved_username')) return 'Nama ini dipakai sistem. Pilih nama lain.';
	if (dbMessage?.includes('invalid_username'))
		return 'Hanya huruf kecil, angka, dan garis bawah (_).';
	if (dbMessage?.includes('not_authenticated')) return 'Sesi kamu habis. Masuk lagi, ya.';
	return 'Nama belum bisa disimpan. Coba lagi sebentar lagi.';
}

export function normalizeEmail(raw: unknown): string {
	return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

export function emailError(email: string): string | null {
	if (!email) return 'Isi alamat email dulu.';
	if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return 'Alamat email belum benar.';
	}
	return null;
}

/** Ambil isi form sebagai teks. Nilai non-teks (misalnya file) dianggap kosong. */
export function formText(form: FormData, key: string): string {
	const value = form.get(key);
	return typeof value === 'string' ? value : '';
}
