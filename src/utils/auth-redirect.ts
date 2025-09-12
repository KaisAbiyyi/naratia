// utils/auth-redirect.ts (atau path yang sesuai)

import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Mendapatkan username profil pengguna untuk redirect.
 * @param userId - ID pengguna yang terotentikasi.
 * @param supabase - Instance Supabase client yang aktif.
 * @returns Promise<string> - Username untuk URL profil, atau fallback.
 */
export async function getUserProfileUsername(
  userId: string,
  supabase: SupabaseClient // <-- 1. Menerima Supabase client sebagai argumen
): Promise<string> {
  try {
    // 2. Menggunakan client yang di-passing, bukan dari import statis
    const { data: profile, error } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single()

    if (error || !profile?.username) {
      // Fallback: gunakan prefix email pengguna
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user?.email) {
        return 'user' // Fallback terakhir
      }
      
      return user.email.split('@')[0]
    }

    return profile.username
  } catch (error) {
    console.error('Error getting user profile username:', error)
    return 'user' // Fallback jika ada exception
  }
} 

/**
 * Mendapatkan URL redirect ke halaman profil pengguna.
 * @param userId - ID pengguna yang terotentikasi.
 * @param supabase - Instance Supabase client yang aktif.
 * @returns Promise<string> - URL redirect lengkap.
 */
export async function getProfileRedirectUrl(
  userId: string,
  supabase: SupabaseClient // <-- 3. Menerima client juga
): Promise<string> {
  // 4. Meneruskan client ke fungsi yang dipanggil
  const username = await getUserProfileUsername(userId, supabase)
  return `/profile/${username}`
}