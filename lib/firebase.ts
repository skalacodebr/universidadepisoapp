// This file exists only to satisfy imports that reference firebase
// The actual authentication is handled by Supabase

import { getSupabaseClient } from "./supabase"

// Re-export Supabase auth as 'auth' to satisfy Firebase imports
export const auth = getSupabaseClient().auth

// Default export for compatibility
export default {
  auth: getSupabaseClient().auth,
}
