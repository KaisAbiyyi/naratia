// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Supabase } from '#lib/server/supabase.ts';

declare global {
	namespace App {
		interface Viewer {
			id: string;
			email: string | null;
			/** `null` kalau pengguna belum memilih username (onboarding). */
			username: string | null;
			isTestAccount: boolean;
		}
		interface Locals {
			/** `null` kalau env Supabase belum diisi. */
			supabase: Supabase | null;
			/** Pengguna yang sudah diverifikasi lewat JWT, atau `null` kalau belum masuk. */
			viewer: Viewer | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
