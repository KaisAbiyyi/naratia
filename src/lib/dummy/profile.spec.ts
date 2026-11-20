import { describe, expect, it } from 'vitest';
import { pendingTasks } from './profile';

describe('tugas hari ini', () => {
	it('menghitung tugas yang belum mencapai target', () => {
		expect(
			pendingTasks([
				{ label: 'a', done: 5, target: 5 },
				{ label: 'b', done: 2, target: 5 },
				{ label: 'c', done: 0, target: 1 }
			])
		).toBe(2);
		expect(pendingTasks([])).toBe(0);
	});
});
