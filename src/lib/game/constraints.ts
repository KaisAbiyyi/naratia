/** Menu constraint ronde (design.md §2, pemegang estafet). Kunci disimpan di rounds.constraint_key. */
export const CONSTRAINT_LABEL: Record<string, string> = {
	tanpa_dialog: 'Tanpa dialog',
	pov_lain: 'Dari sudut pandang tokoh lain',
	maks_satu_tokoh_baru: 'Maksimal 1 tokoh baru',
	kilas_balik: 'Harus ada kilas balik',
	tanpa_tiba_tiba: 'Tanpa kata “tiba-tiba”'
};

export function constraintLabel(key: string | null | undefined): string | null {
	if (!key) return null;
	return CONSTRAINT_LABEL[key] ?? null;
}
