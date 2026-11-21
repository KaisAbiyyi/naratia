import { describe, expect, it } from 'vitest';
import { buildHomeFeed, closesInLabel, storyStateLabel, type HomeStoryRow } from './feed';

const now = new Date('2026-11-20T12:00:00Z');
const row = (over: Partial<HomeStoryRow>): HomeStoryRow => ({
	id: 'id',
	slug: 'slug',
	title: 'Judul',
	genre: 'Misteri',
	mode: 'collab',
	status: 'active',
	paragraph_count: 6,
	updated_at: now.toISOString(),
	round_number: 7,
	round_closes_at: '2026-11-21T09:00:00Z',
	round_constraint_key: 'tanpa_dialog',
	round_candidate_count: 2,
	chapter_status: 'open',
	...over
});

describe('label waktu tutup', () => {
	it.each([
		['2026-11-21T09:00:00Z', 'ditutup 21 jam lagi'],
		['2026-11-20T12:30:00Z', 'ditutup kurang dari 1 jam lagi'],
		['2026-11-23T12:00:00Z', 'ditutup 3 hari lagi'],
		['2026-11-20T11:00:00Z', 'menunggu ditutup']
	])('%s → %s', (at, expected) => {
		expect(closesInLabel(at, now)).toBe(expected);
	});
});

describe('feed Beranda', () => {
	it('ronde kolaborasi dengan kandidat masuk "butuh kamu"', () => {
		const feed = buildHomeFeed([row({})], now);
		expect(feed.featured).toHaveLength(1);
		expect(feed.featured[0]).toMatchObject({
			summary: 'Ronde 7 · menulis ¶7 · 2 kandidat',
			closesIn: 'ditutup 21 jam lagi',
			constraint: 'Tanpa dialog'
		});
		expect(feed.others).toHaveLength(0);
	});

	it('cerita lain diberi label keadaannya', () => {
		expect(storyStateLabel(row({ round_candidate_count: 0 }))).toBe('ronde sepi');
		expect(storyStateLabel(row({ chapter_status: 'voting', round_number: null }))).toBe(
			'voting akhir bab'
		);
		expect(storyStateLabel(row({ status: 'sleeping' }))).toBe('tidur');
		expect(storyStateLabel(row({ mode: 'solo', round_number: null }))).toBe('cerita solo');
	});

	it('baris tanpa id atau judul dilewati', () => {
		const feed = buildHomeFeed([row({ id: null }), row({ title: null })], now);
		expect(feed.featured).toHaveLength(0);
		expect(feed.others).toHaveLength(0);
	});
});
