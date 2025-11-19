import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info.tsx';

// Singleton pattern to prevent multiple GoTrueClient instances
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseInstance = createClient(supabaseUrl, publicAnonKey);
  }
  return supabaseInstance;
};

// Export singleton instance
export const supabase = getSupabase();
