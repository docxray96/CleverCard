import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { supabase } from '@/lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, setLoading } = useAppStore();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        useAppStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            full_name: profile?.full_name || '',
            role: profile?.role || 'teacher',
            school_id: profile?.school_id,
            avatar_url: profile?.avatar_url,
          },
        });
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          useAppStore.setState({ user: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading CleverCard..." />;
  }

  return <>{children}</>;
}