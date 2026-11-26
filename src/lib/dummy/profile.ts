/**
 * Data contoh untuk menu profil (WP-01). Diganti data Supabase di WP-02 (profil)
 * dan WP-10 (tugas harian & streak).
 */

export interface DailyTask {
	label: string;
	done: number;
	target: number;
}

export interface ProfileSummary {
	streakDays: number;
	tasks: DailyTask[];
}

/** Username sekarang dari database (WP-02). Streak dan tugas masih contoh sampai WP-10. */
export const PROFILE_DUMMY: ProfileSummary = {
	streakDays: 3,
	tasks: [
		{ label: 'Baca 5 paragraf baru', done: 0, target: 5 },
		{ label: 'Simpan 1 kartu kutipan', done: 0, target: 1 },
		{ label: 'Beri 1 suara', done: 0, target: 1 },
		{ label: 'Kirim 1 kandidat', done: 0, target: 1 }
	]
};

/** Jumlah tugas yang belum selesai hari ini. */
export function pendingTasks(tasks: readonly DailyTask[]): number {
	return tasks.reduce((n, t) => n + (t.done >= t.target ? 0 : 1), 0);
}
