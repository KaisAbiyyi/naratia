import { describe, expect, it } from 'vitest';
import { THEME_OPTIONS, parseThemePref } from './theme';

describe('tema', () => {
	it('pilihan berurutan: ikut sistem, terang, gelap', () => {
		expect(THEME_OPTIONS).toEqual(['system', 'light', 'dark']);
	});

	it('nilai tersimpan yang tidak dikenal dianggap ikut sistem', () => {
		expect(parseThemePref('dark')).toBe('dark');
		expect(parseThemePref('light')).toBe('light');
		expect(parseThemePref(null)).toBe('system');
		expect(parseThemePref('ungu')).toBe('system');
	});
});
