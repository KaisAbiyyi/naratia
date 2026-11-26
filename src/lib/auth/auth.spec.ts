import { describe, expect, it } from 'vitest';
import { needsOnboarding, safeNext } from './guard';
import { claimUsernameMessage, emailError, normalizeUsername, usernameError } from './validate';

describe('username', () => {
	it('dinormalisasi ke huruf kecil tanpa spasi tepi', () => {
		expect(normalizeUsername('  Lentera_7 ')).toBe('lentera_7');
		expect(normalizeUsername(42)).toBe('');
	});

	it('divalidasi panjang, karakter, dan nama sistem', () => {
		expect(usernameError('ab')).toMatch(/Minimal/);
		expect(usernameError('a'.repeat(21))).toMatch(/Maksimal/);
		expect(usernameError('nama-pena')).toMatch(/huruf kecil/);
		expect(usernameError('admin')).toMatch(/sistem/);
		expect(usernameError('lentera')).toBeNull();
	});

	it('galat database diterjemahkan', () => {
		expect(claimUsernameMessage('username_taken')).toMatch(/sudah dipakai/);
		expect(claimUsernameMessage(undefined)).toMatch(/Coba lagi/);
	});
});

describe('email', () => {
	it('wajib dan harus berformat email', () => {
		expect(emailError('')).toMatch(/Isi/);
		expect(emailError('bukan-email')).toMatch(/belum benar/);
		expect(emailError('kamu@contoh.id')).toBeNull();
	});
});

describe('navigasi login', () => {
	it('pengguna tanpa username diarahkan ke onboarding, kecuali rute pengecualian', () => {
		expect(needsOnboarding('/', false, true)).toBe(true);
		expect(needsOnboarding('/mulai', false, true)).toBe(false);
		expect(needsOnboarding('/auth/callback', false, true)).toBe(false);
		expect(needsOnboarding('/', true, true)).toBe(false);
		expect(needsOnboarding('/', false, false)).toBe(false);
	});

	it('parameter next hanya menerima path di situs ini', () => {
		expect(safeNext('/profil')).toBe('/profil');
		expect(safeNext('https://jahat.example')).toBe('/');
		expect(safeNext('//jahat.example')).toBe('/');
		expect(safeNext('/\\jahat.example')).toBe('/');
		expect(safeNext(null)).toBe('/');
	});
});
