import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';

export default function Index() {
  const router = useRouter();
  const currentInstance = useStore(state => state.currentInstance);
  const loadInstances = useStore(state => state.loadInstances);
  const loadWatchHistory = useStore(state => state.loadWatchHistory);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Load saved data
    await loadInstances();
    await loadWatchHistory();
    
    // Small delay to ensure state is loaded
    setTimeout(() => {
      // Check if user has a current instance
      const instance = useStore.getState().currentInstance;
      
      if (instance) {
        // User has an instance (logged in or guest), go to home
        router.replace('/(tabs)/home');
      } else {
        // No instance, go to connection manager
        router.replace('/connection-manager');
      }
    }, 100);
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
