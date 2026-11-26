import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.viewer?.username || !locals.supabase) {
		redirect(303, `/masuk?next=${encodeURIComponent('/profil')}`);
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('username, created_at')
		.eq('id', locals.viewer.id)
		.single();

	return {
		username: profile?.username ?? locals.viewer.username,
		joinedAt: profile?.created_at ?? null,
		// Email hanya ditampilkan ke pemiliknya sendiri.
		email: locals.viewer.email
	};
};
