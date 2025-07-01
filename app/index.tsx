import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function IndexScreen() {
  const { user, isLoading } = useAppStore();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, isLoading]);

  return <LoadingSpinner text="Initializing CleverCard..." />;
}