import { PUBLIC_DEV_PANEL, VERCEL_ENV } from '$app/env/private';
import { isDevPanelEnabled } from './dev-gate';

export const devPanelEnabled = isDevPanelEnabled(PUBLIC_DEV_PANEL, VERCEL_ENV);
