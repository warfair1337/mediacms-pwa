import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { MediaCMSAPI } from '../../services/api';
import { VideoCard } from '../../components/VideoCard';
import { Video, Playlist } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Library() {
  const router = useRouter();
  const currentInstance = useStore(state => state.currentInstance);
  const watchHistory = useStore(state => state.watchHistory);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'playlists'>('history');

  useEffect(() => {
    if (currentInstance) {
      loadPlaylists();
    }
  }, [currentInstance]);

  const loadPlaylists = async () => {
    if (!currentInstance?.token) {
      setLoading(false);
      return;
    }

    try {
      const api = new MediaCMSAPI(currentInstance.url, currentInstance.token);
      const data = await api.getPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to load playlists:', error);
      setPlaylists([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPlaylists();
  };

  const handleVideoPress = (video: Video) => {
    router.push(`/video/${video.friendly_token}`);
  };

  const renderHistory = () => {
    if (watchHistory.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>No watch history</Text>
          <Text style={styles.emptySubtext}>
            Videos you watch will appear here
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={watchHistory}
        keyExtractor={(item) => item.friendly_token}
        renderItem={({ item }) => (
          <VideoCard video={item} onPress={() => handleVideoPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF0000"
            colors={['#FF0000']}
          />
        }
      />
    );
  };

  const renderPlaylists = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF0000" />
          <Text style={styles.loadingText}>Loading playlists...</Text>
        </View>
      );
    }

    if (playlists.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="list-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>No playlists found</Text>
          <Text style={styles.emptySubtext}>
            Create playlists on the web to see them here
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.friendly_token}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.playlistCard}>
            <View style={styles.playlistIcon}>
              <Ionicons name="list" size={24} color="#FF0000" />
            </View>
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistTitle}>{item.title}</Text>
              <Text style={styles.playlistCount}>{item.media_count} videos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF0000"
            colors={['#FF0000']}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}
          >
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'playlists' && styles.tabActive]}
          onPress={() => setActiveTab('playlists')}
        >
          <Text
            style={[styles.tabText, activeTab === 'playlists' && styles.tabTextActive]}
          >
            Playlists
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'history' ? renderHistory() : renderPlaylists()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF0000',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  playlistIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  playlistCount: {
    color: '#888',
    fontSize: 12,
  },
});
