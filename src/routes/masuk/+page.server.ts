import { fail, redirect } from '@sveltejs/kit';
import { safeNext } from '#lib/auth/guard.ts';
import { emailError, formText, normalizeEmail } from '#lib/auth/validate.ts';
import { enabledProviders } from '#lib/server/supabase.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
	const next = safeNext(url.searchParams.get('next'));
	if (locals.viewer) redirect(303, next);
	const { google } = await enabledProviders(fetch);
	return {
		next,
		google,
		connected: Boolean(locals.supabase),
		callbackError: url.searchParams.get('galat') === 'tautan'
	};
};

const callbackUrl = (origin: string, next: string) =>
	`${origin}/auth/callback?next=${encodeURIComponent(next)}`;

export const actions: Actions = {
	email: async ({ request, locals, url }) => {
		const form = await request.formData();
		const email = normalizeEmail(formText(form, 'email'));
		const next = safeNext(formText(form, 'next'));
		const error = emailError(email);
		if (error) return fail(400, { email, error });
		if (!locals.supabase) return fail(503, { email, error: 'Server belum terhubung ke database.' });

		const { error: authError } = await locals.supabase.auth.signInWithOtp({
			email,
			options: { emailRedirectTo: callbackUrl(url.origin, next), shouldCreateUser: true }
		});
		if (authError) {
			const tooSoon = authError.status === 429 || /security purposes|rate/i.test(authError.message);
			return fail(tooSoon ? 429 : 400, {
				email,
				error: tooSoon
					? 'Tunggu sebentar sebelum minta tautan lagi (sekitar 1 menit).'
					: 'Tautan belum bisa dikirim. Coba lagi sebentar lagi.'
			});
		}
		return { sent: true, email };
	},

	google: async ({ request, locals, url }) => {
		const form = await request.formData();
		const next = safeNext(formText(form, 'next'));
		if (!locals.supabase) return fail(503, { error: 'Server belum terhubung ke database.' });
		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: callbackUrl(url.origin, next) }
		});
		if (error || !data.url) return fail(400, { error: 'Login Google belum bisa dipakai.' });
		redirect(303, data.url);
	}
};
