import { describe, expect, it } from 'vitest';
import { nextThemePref, parseThemePref } from './theme';

describe('tema', () => {
	it('berputar: ikut sistem → terang → gelap → ikut sistem', () => {
		expect(nextThemePref('system')).toBe('light');
		expect(nextThemePref('light')).toBe('dark');
		expect(nextThemePref('dark')).toBe('system');
	});

	it('nilai tersimpan yang tidak dikenal dianggap ikut sistem', () => {
		expect(parseThemePref('dark')).toBe('dark');
		expect(parseThemePref('light')).toBe('light');
		expect(parseThemePref(null)).toBe('system');
		expect(parseThemePref('ungu')).toBe('system');
	});
});
