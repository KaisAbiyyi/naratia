import { describe, expect, it } from 'vitest';
import { isDevPanelEnabled } from './dev-gate';

describe('gerbang panel /dev', () => {
	it('menyala hanya kalau PUBLIC_DEV_PANEL=1 dan bukan production', () => {
		expect(isDevPanelEnabled(true, 'preview')).toBe(true);
		expect(isDevPanelEnabled(true, undefined)).toBe(true);
	});

	it('mati kalau flag tidak diisi', () => {
		expect(isDevPanelEnabled(false, 'preview')).toBe(false);
		expect(isDevPanelEnabled(undefined, undefined)).toBe(false);
	});

	it('mati di production walaupun flag terisi', () => {
		expect(isDevPanelEnabled(true, 'production')).toBe(false);
	});
});
