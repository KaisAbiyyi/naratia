import { error } from '@sveltejs/kit';
import { devPanelEnabled } from '#lib/server/dev-panel.ts';
import type { PageServerLoad } from './$types';

export type DevTab = 'peta' | 'komponen';

export const load: PageServerLoad = ({ url, setHeaders }) => {
	// Di production (atau tanpa PUBLIC_DEV_PANEL=1) panel ini tidak ada sama sekali.
	if (!devPanelEnabled) error(404, 'Halaman tidak ditemukan');

	setHeaders({ 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'no-store' });

	const tab: DevTab = url.searchParams.get('tab') === 'komponen' ? 'komponen' : 'peta';
	return { tab };
};
