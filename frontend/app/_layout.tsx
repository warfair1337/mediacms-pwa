import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function RootLayout() {
  const loadInstances = useStore(state => state.loadInstances);
  const loadWatchHistory = useStore(state => state.loadWatchHistory);

  useEffect(() => {
    loadInstances();
    loadWatchHistory();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0F0F0F',
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: '#0F0F0F',
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="connection-manager" options={{ title: 'Connections' }} />
      <Stack.Screen name="add-instance" options={{ title: 'Add Instance' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="video/[id]" 
        options={{ 
          title: 'Video',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}
