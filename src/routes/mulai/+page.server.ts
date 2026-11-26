import { fail, redirect } from '@sveltejs/kit';
import { safeNext } from '#lib/auth/guard.ts';
import {
	claimUsernameMessage,
	formText,
	normalizeUsername,
	usernameError
} from '#lib/auth/validate.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	const next = safeNext(url.searchParams.get('next'));
	if (!locals.viewer) redirect(303, `/masuk?next=${encodeURIComponent('/mulai')}`);
	if (locals.viewer.username) redirect(303, next);
	return { next };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.viewer || !locals.supabase) redirect(303, '/masuk');
		const form = await request.formData();
		const username = normalizeUsername(formText(form, 'username'));
		const next = safeNext(formText(form, 'next'));

		const error = usernameError(username);
		if (error) return fail(400, { username, error });

		const { error: dbError } = await locals.supabase.rpc('claim_username', {
			p_username: username
		});
		if (dbError) return fail(400, { username, error: claimUsernameMessage(dbError.message) });

		redirect(303, next);
	}
};
