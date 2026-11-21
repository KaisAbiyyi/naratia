import { describe, expect, it } from 'vitest';
import { WP_MAP, currentWp, doneCount, lastDoneWp, nextWp, type WorkPackage } from './wp-map';

const wp = (id: string, status: WorkPackage['status']): WorkPackage => ({
	id,
	title: id,
	milestone: 'M0',
	status,
	checks: []
});

describe('peta WP', () => {
	it('berisi 13 WP berurutan dengan id unik', () => {
		expect(WP_MAP).toHaveLength(13);
		expect(WP_MAP.map((w) => w.id)).toEqual(
			Array.from({ length: 13 }, (_, i) => `WP-${String(i + 1).padStart(2, '0')}`)
		);
	});

	it('setiap WP punya minimal satu langkah cek', () => {
		for (const w of WP_MAP) expect(w.checks.length).toBeGreaterThan(0);
	});

	it('WP-01 selesai, WP-02 berjalan, WP-03 berikutnya', () => {
		expect(lastDoneWp(WP_MAP)?.id).toBe('WP-01');
		expect(currentWp(WP_MAP)?.id).toBe('WP-02');
		expect(nextWp(WP_MAP)?.id).toBe('WP-03');
	});

	it('berikutnya dicari setelah WP yang berjalan', () => {
		const map = [wp('A', 'selesai'), wp('B', 'backlog'), wp('C', 'revisi'), wp('D', 'siap')];
		expect(currentWp(map)?.id).toBe('C');
		expect(nextWp(map)?.id).toBe('D');
		expect(doneCount(map)).toBe(1);
		expect(lastDoneWp(map)?.id).toBe('A');
	});

	it('tanpa WP berjalan, berikutnya = WP pertama yang belum dimulai', () => {
		const map = [wp('A', 'selesai'), wp('B', 'siap')];
		expect(currentWp(map)).toBeUndefined();
		expect(nextWp(map)?.id).toBe('B');
	});
});
