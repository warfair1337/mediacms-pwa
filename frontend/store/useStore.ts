import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MediaCMSInstance, User, Video } from '../types';
import axios from 'axios';

interface AppState {
  // State
  instances: MediaCMSInstance[];
  currentInstance: MediaCMSInstance | null;
  currentUser: User | null;
  isLoading: boolean;
  watchHistory: Video[];
  
  // Actions
  loadInstances: () => Promise<void>;
  addInstance: (instance: MediaCMSInstance) => Promise<void>;
  removeInstance: (id: string) => Promise<void>;
  setCurrentInstance: (instance: MediaCMSInstance | null) => Promise<void>;
  login: (instanceUrl: string, username: string, password: string) => Promise<MediaCMSInstance>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  addToWatchHistory: (video: Video) => Promise<void>;
  loadWatchHistory: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  instances: [],
  currentInstance: null,
  currentUser: null,
  isLoading: false,
  watchHistory: [],

  loadInstances: async () => {
    try {
      const stored = await AsyncStorage.getItem('mediacms_instances');
      const current = await AsyncStorage.getItem('current_instance');
      
      if (stored) {
        const instances = JSON.parse(stored);
        set({ instances });
      }
      
      if (current) {
        const currentInstance = JSON.parse(current);
        set({ currentInstance });
      }
    } catch (error) {
      console.error('Failed to load instances:', error);
    }
  },

  addInstance: async (instance: MediaCMSInstance) => {
    const { instances } = get();
    const newInstances = [...instances, instance];
    set({ instances: newInstances });
    await AsyncStorage.setItem('mediacms_instances', JSON.stringify(newInstances));
  },

  removeInstance: async (id: string) => {
    const { instances, currentInstance } = get();
    const newInstances = instances.filter(i => i.id !== id);
    set({ instances: newInstances });
    await AsyncStorage.setItem('mediacms_instances', JSON.stringify(newInstances));
    
    // If removing current instance, clear it
    if (currentInstance?.id === id) {
      set({ currentInstance: null, currentUser: null });
      await AsyncStorage.removeItem('current_instance');
    }
  },

  setCurrentInstance: async (instance: MediaCMSInstance | null) => {
    set({ currentInstance: instance });
    if (instance) {
      await AsyncStorage.setItem('current_instance', JSON.stringify(instance));
    } else {
      await AsyncStorage.removeItem('current_instance');
    }
  },

  login: async (instanceUrl: string, username: string, password: string) => {
    try {
      set({ isLoading: true });
      
      // Clean URL
      let cleanUrl = instanceUrl.trim();
      if (!cleanUrl.startsWith('http')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      cleanUrl = cleanUrl.replace(/\/$/, '');
      
      // Attempt login
      const loginResponse = await axios.post(
        `${cleanUrl}/api/v1/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const token = loginResponse.data.token;
      
      // Get user info
      const userResponse = await axios.get(
        `${cleanUrl}/api/v1/whoami`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const user = userResponse.data;
      
      // Create instance object
      const instance: MediaCMSInstance = {
        id: Date.now().toString(),
        name: cleanUrl.replace(/https?:\/\//, ''),
        url: cleanUrl,
        username,
        token,
      };
      
      // Add to instances if not exists
      const { instances } = get();
      const exists = instances.find(i => i.url === cleanUrl && i.username === username);
      
      if (!exists) {
        await get().addInstance(instance);
      } else {
        // Update token for existing instance
        const updatedInstances = instances.map(i => 
          i.url === cleanUrl && i.username === username 
            ? { ...i, token } 
            : i
        );
        set({ instances: updatedInstances });
        await AsyncStorage.setItem('mediacms_instances', JSON.stringify(updatedInstances));
      }
      
      await get().setCurrentInstance(instance);
      set({ currentUser: user, isLoading: false });
      
      return instance;
    } catch (error: any) {
      set({ isLoading: false });
      console.error('Login failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  },

  logout: async () => {
    set({ currentInstance: null, currentUser: null });
    await AsyncStorage.removeItem('current_instance');
  },

  setUser: (user: User | null) => {
    set({ currentUser: user });
  },

  addToWatchHistory: async (video: Video) => {
    const { watchHistory } = get();
    const filtered = watchHistory.filter(v => v.friendly_token !== video.friendly_token);
    const newHistory = [video, ...filtered].slice(0, 50); // Keep last 50
    set({ watchHistory: newHistory });
    await AsyncStorage.setItem('watch_history', JSON.stringify(newHistory));
  },

  loadWatchHistory: async () => {
    try {
      const stored = await AsyncStorage.getItem('watch_history');
      if (stored) {
        set({ watchHistory: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load watch history:', error);
    }
  },
}));
