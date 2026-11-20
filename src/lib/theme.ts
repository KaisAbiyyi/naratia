/** Pilihan tema. `system` = ikut pengaturan HP/OS. */
export type ThemePref = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'naratia-theme';

const ORDER: readonly ThemePref[] = ['system', 'light', 'dark'];

export const THEME_LABEL: Record<ThemePref, string> = {
	system: 'Ikut sistem',
	light: 'Terang',
	dark: 'Gelap'
};

/** Nilai tersimpan yang tidak dikenal dianggap `system`. */
export function parseThemePref(value: unknown): ThemePref {
	return value === 'light' || value === 'dark' ? value : 'system';
}

/** Urutan tombol tema: ikut sistem → terang → gelap → ikut sistem. */
export function nextThemePref(current: ThemePref): ThemePref {
	return ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
}
