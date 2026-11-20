import { describe, expect, it } from 'vitest';
import { greetingFor, localHour } from './greeting';

// Jam WIB = UTC+7.
const wib = (h: number) => new Date(Date.UTC(2026, 10, 20, (h - 7 + 24) % 24, 30));

describe('salam', () => {
	it('memakai jam WIB, bukan jam server', () => {
		expect(localHour(wib(20))).toBe(20);
	});

	it.each([
		[4, 'Selamat pagi'],
		[10, 'Selamat pagi'],
		[11, 'Selamat siang'],
		[14, 'Selamat siang'],
		[15, 'Selamat sore'],
		[17, 'Selamat sore'],
		[18, 'Selamat malam'],
		[0, 'Selamat malam'],
		[3, 'Selamat malam']
	])('jam %i → %s', (h, expected) => {
		expect(greetingFor(wib(h))).toBe(expected);
	});
});
