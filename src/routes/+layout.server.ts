import { devPanelEnabled } from '#lib/server/dev-panel.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({ devPanel: devPanelEnabled });
