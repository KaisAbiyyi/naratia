import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { needsOnboarding } from '#lib/auth/guard.ts';
import { createRequestClient } from '#lib/server/supabase.ts';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createRequestClient(event.cookies);
	event.locals.supabase = supabase;
	event.locals.viewer = null;

	if (supabase) {
		// getClaims memverifikasi JWT (tanda tangan + kedaluwarsa), bukan sekadar membaca cookie.
		const { data } = await supabase.auth.getClaims();
		const claims = data?.claims;
		if (claims?.sub) {
			const { data: profile } = await supabase
				.from('profiles')
				.select('username')
				.eq('id', claims.sub)
				.maybeSingle();
			const appMeta = (claims.app_metadata ?? {}) as { test_account?: boolean };
			event.locals.viewer = {
				id: claims.sub,
				email: typeof claims.email === 'string' ? claims.email : null,
				username: profile?.username ?? null,
				isTestAccount: appMeta.test_account === true
			};
		}
	}

	const viewer = event.locals.viewer;
	if (needsOnboarding(event.url.pathname, Boolean(viewer?.username), Boolean(viewer))) {
		redirect(303, `/mulai?next=${encodeURIComponent(event.url.pathname + event.url.search)}`);
	}

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
};
