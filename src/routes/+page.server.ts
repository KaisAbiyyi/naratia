import { greetingFor } from '#lib/greeting.ts';
import { HOME_DUMMY } from '#lib/dummy/home.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	greeting: greetingFor(new Date()),
	home: HOME_DUMMY
});
