import { devPanelEnabled } from '#lib/server/dev-panel.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => ({
	devPanel: devPanelEnabled,
	viewer: locals.viewer?.username
		? { username: locals.viewer.username, isTestAccount: locals.viewer.isTestAccount }
		: null
});
