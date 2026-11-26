import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$app/env/private';
import type { Database } from '#lib/supabase/database.types.ts';

export type Supabase = SupabaseClient<Database>;

/** `true` kalau env Supabase terisi. Tanpa itu aplikasi tetap jalan dengan state "belum terhubung". */
export const supabaseConfigured = Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_PUBLISHABLE_KEY);

/** Klien per request yang membaca dan menulis cookie sesi. RLS berlaku sebagai pengguna itu. */
export function createRequestClient(cookies: Cookies): Supabase | null {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_PUBLISHABLE_KEY) return null;
	return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (toSet) => {
				for (const { name, value, options } of toSet) {
					cookies.set(name, value, { ...options, path: '/' });
				}
			}
		}
	});
}

/** Klien terpisah tanpa cookie, untuk aksi server yang tidak boleh mengubah sesi pengguna. */
export function createIsolatedClient(): Supabase | null {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_PUBLISHABLE_KEY) return null;
	return createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
	});
}

/** Daftar provider login yang aktif di Supabase (misalnya Google), di-cache 5 menit. */
let providerCache: { at: number; google: boolean } | undefined;
export async function enabledProviders(fetchFn: typeof fetch): Promise<{ google: boolean }> {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_PUBLISHABLE_KEY) return { google: false };
	if (providerCache && Date.now() - providerCache.at < 5 * 60_000) return providerCache;
	try {
		const res = await fetchFn(`${PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
			headers: { apikey: PUBLIC_SUPABASE_PUBLISHABLE_KEY }
		});
		const body = (await res.json()) as { external?: { google?: boolean } };
		providerCache = { at: Date.now(), google: body.external?.google === true };
	} catch {
		providerCache = { at: Date.now(), google: false };
	}
	return providerCache;
}
