import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { MediaCMSAPI } from '../../services/api';
import { Video as VideoType } from '../../types';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function VideoPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const currentInstance = useStore(state => state.currentInstance);
  const addToWatchHistory = useStore(state => state.addToWatchHistory);
  const videoRef = useRef<Video>(null);
  
  const [video, setVideo] = useState<VideoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && currentInstance) {
      loadVideo();
    }
  }, [id, currentInstance]);

  const loadVideo = async () => {
    if (!currentInstance) return;

    try {
      setLoading(true);
      setError('');
      const api = new MediaCMSAPI(currentInstance.url, currentInstance.token);
      const videoData = await api.getVideo(id as string);
      setVideo(videoData);
      await addToWatchHistory(videoData);
    } catch (err: any) {
      console.error('Failed to load video:', err);
      setError('Failed to load video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVideoUrl = () => {
    if (!video || !currentInstance) return '';
    
    // Try to get the best quality stream
    if (video.encodings_info?.original_media_url) {
      return video.encodings_info.original_media_url;
    }
    
    // Fallback to the direct URL
    return `${currentInstance.url}${video.url}`;
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading video...</Text>
      </View>
    );
  }

  if (error || !video) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF0000" />
        <Text style={styles.errorText}>{error || 'Video not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVideo}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const videoUrl = getVideoUrl();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          {videoUrl ? (
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              shouldPlay={false}
            />
          ) : (
            <View style={styles.placeholderVideo}>
              <Ionicons name="videocam-off" size={48} color="#666" />
              <Text style={styles.placeholderText}>Video unavailable</Text>
            </View>
          )}
        </View>

        {/* Video Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{video.title}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {formatViews(video.views)} views
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>
              {formatDate(video.add_date)}
            </Text>
          </View>

          {/* Author */}
          <View style={styles.authorContainer}>
            <View style={styles.authorAvatar}>
              <Ionicons name="person" size={20} color="#FFF" />
            </View>
            <Text style={styles.authorName}>{video.author}</Text>
          </View>

          {/* Description */}
          {video.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{video.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    color: '#FFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    width: width,
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholderVideo: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
    marginTop: 12,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaText: {
    color: '#AAA',
    fontSize: 14,
  },
  metaDot: {
    color: '#AAA',
    marginHorizontal: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  descriptionTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#AAA',
    fontSize: 14,
    lineHeight: 20,
  },
});
