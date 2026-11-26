import { redirect } from '@sveltejs/kit';
import { safeNext } from '#lib/auth/guard.ts';
import type { RequestHandler } from './$types';

/** Tujuan tautan magic link dan login Google (alur PKCE). */
export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const next = safeNext(url.searchParams.get('next'));

	if (!code || !locals.supabase) redirect(303, '/masuk?galat=tautan');

	const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);
	if (error || !data.user) redirect(303, '/masuk?galat=tautan');

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('username')
		.eq('id', data.user.id)
		.maybeSingle();

	redirect(303, profile ? next : `/mulai?next=${encodeURIComponent(next)}`);
};
