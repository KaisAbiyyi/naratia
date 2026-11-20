import { browser } from '$app/env';
import { THEME_STORAGE_KEY, nextThemePref, parseThemePref, type ThemePref } from './theme';

function readStored(): ThemePref {
	try {
		return parseThemePref(localStorage.getItem(THEME_STORAGE_KEY));
	} catch {
		return 'system';
	}
}

function apply(pref: ThemePref) {
	const root = document.documentElement;
	if (pref === 'system') delete root.dataset.theme;
	else root.dataset.theme = pref;
	try {
		if (pref === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
		else localStorage.setItem(THEME_STORAGE_KEY, pref);
	} catch {
		// Penyimpanan bisa diblokir (mode privat). Tema tetap berlaku untuk sesi ini.
	}
}

class ThemeState {
	pref = $state<ThemePref>('system');

	/** Dipanggil sekali setelah hidrasi. Skrip di app.html sudah memasang atributnya. */
	sync() {
		if (browser) this.pref = readStored();
	}

	cycle() {
		this.pref = nextThemePref(this.pref);
		apply(this.pref);
	}
}

export const theme = new ThemeState();
