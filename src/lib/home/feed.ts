/**
 * Mengubah baris view `home_stories` menjadi kartu Beranda. Fungsi murni, O(n) atas cerita.
 */
import { constraintLabel } from '#lib/game/constraints.ts';
import type { Database } from '#lib/supabase/database.types.ts';

export type HomeStoryRow = Database['public']['Views']['home_stories']['Row'];

export interface FeaturedRound {
	id: string;
	slug: string;
	title: string;
	genre: string;
	/** Contoh: "Ronde 7 · menulis ¶7 · 2 kandidat". */
	summary: string;
	closesIn: string;
	constraint: string | null;
	paragraphs: number;
}

export interface OtherStory {
	id: string;
	slug: string;
	title: string;
	state: string;
}

export interface HomeFeed {
	featured: FeaturedRound[];
	others: OtherStory[];
}

/** "ditutup 21 jam lagi", "ditutup 2 hari lagi", dan seterusnya. */
export function closesInLabel(closesAt: string, now: Date): string {
	const ms = new Date(closesAt).getTime() - now.getTime();
	if (Number.isNaN(ms)) return '';
	if (ms <= 0) return 'menunggu ditutup';
	const hours = Math.floor(ms / 3_600_000);
	if (hours < 1) return 'ditutup kurang dari 1 jam lagi';
	if (hours < 48) return `ditutup ${hours} jam lagi`;
	return `ditutup ${Math.floor(hours / 24)} hari lagi`;
}

/** Label singkat untuk cerita yang tidak sedang butuh pemilih. */
export function storyStateLabel(row: HomeStoryRow): string {
	if (row.status === 'sleeping') return 'tidur';
	if (row.status === 'ended') return 'tamat';
	if (row.chapter_status === 'voting') return 'voting akhir bab';
	if (row.mode === 'solo') return 'cerita solo';
	if (row.round_number !== null && (row.round_candidate_count ?? 0) === 0) return 'ronde sepi';
	return 'berjalan';
}

/** Ronde yang butuh orang: cerita kolaborasi aktif dengan ronde terbuka yang sudah punya kandidat. */
function isFeatured(row: HomeStoryRow): boolean {
	return (
		row.status === 'active' &&
		row.mode === 'collab' &&
		row.chapter_status !== 'voting' &&
		row.round_number !== null &&
		(row.round_candidate_count ?? 0) > 0
	);
}

export function buildHomeFeed(rows: readonly HomeStoryRow[], now: Date): HomeFeed {
	const featured: FeaturedRound[] = [];
	const others: OtherStory[] = [];
	for (const row of rows) {
		if (!row.id || !row.slug || !row.title) continue;
		if (isFeatured(row)) {
			const paragraphs = row.paragraph_count ?? 0;
			featured.push({
				id: row.id,
				slug: row.slug,
				title: row.title,
				genre: row.genre ?? '',
				summary: `Ronde ${row.round_number} · menulis ¶${paragraphs + 1} · ${row.round_candidate_count} kandidat`,
				closesIn: row.round_closes_at ? closesInLabel(row.round_closes_at, now) : '',
				constraint: constraintLabel(row.round_constraint_key),
				paragraphs
			});
		} else {
			others.push({ id: row.id, slug: row.slug, title: row.title, state: storyStateLabel(row) });
		}
	}
	return { featured, others };
}
