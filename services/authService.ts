import { supabase } from '@/lib/supabase';
import { User } from '../types';

// Helper to build User from profile + session data
function buildUser(
  id: string,
  email: string,
  profile: Record<string, unknown> | null
): User {
  const name = profile
    ? ((profile.full_name as string) || email.split('@')[0])
    : email.split('@')[0];

  const role: 'admin' | 'customer' =
    profile && profile.role === 'admin'
      ? 'admin'
      : email.toLowerCase() === 'admin@foodhub.com'
      ? 'admin'
      : 'customer';

  return {
    id,
    email,
    name,
    role,
    address: (profile?.address as string) || '',
    phone: (profile?.phone as string) || '',
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`,
  };
}

export const authService = {
  getCurrentUser: async (): Promise<User | null> => {
    if (typeof window === 'undefined') return null;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return buildUser(session.user.id, session.user.email || '', profile);
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      throw error;
    }

    const sessionUser = data.user;
    if (!sessionUser) throw new Error('No user returned after login');

    // Fetch profile; if missing, create a default one
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionUser.id)
      .single();

    if (profileErr || !profile) {
      const role: 'admin' | 'customer' =
        email.toLowerCase() === 'admin@foodhub.com' ? 'admin' : 'customer';
      const name = email.split('@')[0];

      await supabase.from('profiles').upsert(
        [{ id: sessionUser.id, full_name: name, role, address: '', phone: '' }],
        { onConflict: 'id' }
      );

      return buildUser(sessionUser.id, email, { full_name: name, role });
    }

    return buildUser(sessionUser.id, email, profile);
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: email.toLowerCase() === 'admin@foodhub.com' ? 'admin' : 'customer',
        },
      },
    });

    if (error) {
      console.error('Signup error:', error.message);
      throw error;
    }

    const sessionUser = data.user;
    if (!sessionUser) throw new Error('User creation failed');

    const role: 'admin' | 'customer' =
      email.toLowerCase() === 'admin@foodhub.com' ? 'admin' : 'customer';

    // Insert profile row (trigger may have already created it — upsert is safe)
    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert(
        [{ id: sessionUser.id, full_name: name, role, address: '', phone: '' }],
        { onConflict: 'id' }
      );

    if (profileErr) {
      console.error('Error creating profile on signup:', profileErr.message);
    }

    return buildUser(sessionUser.id, email, { full_name: name, role });
  },

  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  updateProfile: async (updatedUser: User): Promise<User> => {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updatedUser.name,
        address: updatedUser.address,
        phone: updatedUser.phone,
        // Do NOT update role from front-end — role is managed by DB trigger / admin SQL
      })
      .eq('id', updatedUser.id);

    if (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }

    return updatedUser;
  },
};
