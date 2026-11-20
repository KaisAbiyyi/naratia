import { greetingFor } from '#lib/greeting.ts';
import { HOME_DUMMY } from '#lib/dummy/home.ts';
import { PROFILE_DUMMY } from '#lib/dummy/profile.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	greeting: greetingFor(new Date()),
	streakDays: PROFILE_DUMMY.streakDays,
	home: HOME_DUMMY
});
