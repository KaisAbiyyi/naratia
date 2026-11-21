import { greetingFor } from '#lib/greeting.ts';
import { PROFILE_DUMMY } from '#lib/dummy/profile.ts';
import { buildHomeFeed, type HomeFeed } from '#lib/home/feed.ts';
import type { PageServerLoad } from './$types';

const HOME_LIMIT = 30;

export const load: PageServerLoad = async ({ locals }) => {
	let feed: HomeFeed | null = null;
	if (locals.supabase) {
		// Satu query ke view home_stories (index stories_status_updated_idx), tidak tumbuh dengan isi cerita.
		const { data, error } = await locals.supabase
			.from('home_stories')
			.select('*')
			.order('updated_at', { ascending: false })
			.limit(HOME_LIMIT);
		if (!error) feed = buildHomeFeed(data ?? [], new Date());
	}

	return {
		greeting: greetingFor(new Date()),
		streakDays: PROFILE_DUMMY.streakDays,
		feed
	};
};
