/** Pilihan tema. `system` = ikut pengaturan HP/OS. */
export type ThemePref = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'naratia-theme';

/** Urutan pilihan di pengaturan tema. */
export const THEME_OPTIONS: readonly ThemePref[] = ['system', 'light', 'dark'];

export const THEME_LABEL: Record<ThemePref, string> = {
	system: 'Sistem',
	light: 'Terang',
	dark: 'Gelap'
};

/** Nilai tersimpan yang tidak dikenal dianggap `system`. */
export function parseThemePref(value: unknown): ThemePref {
	return value === 'light' || value === 'dark' ? value : 'system';
}
