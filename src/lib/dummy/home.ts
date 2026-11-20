/**
 * Data contoh untuk Beranda statis (WP-01). Diganti data Supabase di WP-02.
 * Isinya meniru layar Beranda di prototype/naratia-alur.html.
 */

export interface FeaturedRound {
	id: string;
	title: string;
	genre: string;
	/** Contoh: "Ronde 7 · menulis ¶7 · 2 kandidat". */
	summary: string;
	closesIn: string;
	constraint?: string;
	newParagraphs: number;
}

export interface OtherStory {
	id: string;
	title: string;
	state: string;
}

export interface HomeData {
	tinta: number;
	cards: number;
	featured: FeaturedRound[];
	others: OtherStory[];
}

export const HOME_DUMMY: HomeData = {
	tinta: 50,
	cards: 0,
	featured: [
		{
			id: 'mercusuar-pulau-garam',
			title: 'Mercusuar Pulau Garam',
			genre: 'Misteri',
			summary: 'Ronde 7 · menulis ¶7 · 2 kandidat',
			closesIn: 'ditutup 21 jam lagi',
			constraint: 'Tanpa dialog',
			newParagraphs: 6
		}
	],
	others: [
		{ id: 'pasar-malam-terakhir', title: 'Pasar Malam Terakhir', state: 'voting akhir bab' },
		{ id: 'kota-yang-lupa-hujan', title: 'Kota yang Lupa Hujan', state: 'ronde sepi' }
	]
};
