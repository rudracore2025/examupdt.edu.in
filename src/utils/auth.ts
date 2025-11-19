import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export const auth = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<{ user: AuthUser; token: string } | null> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw new Error(error.message);
      }

      if (data.session) {
        localStorage.setItem('supabase_access_token', data.session.access_token);
        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name,
          },
          token: data.session.access_token,
        };
      }

      return null;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase_access_token');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current session
  getSession: async (): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        return null;
      }

      localStorage.setItem('supabase_access_token', data.session.access_token);

      return {
        id: data.session.user.id,
        email: data.session.user.email!,
        name: data.session.user.user_metadata?.name,
      };
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const user = await auth.getSession();
    return !!user;
  },
};
