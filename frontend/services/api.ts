import axios, { AxiosInstance } from 'axios';
import { Video, SearchResult, Playlist, User } from '../types';

export class MediaCMSAPI {
  private client: AxiosInstance;
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
    
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    this.client = axios.create({
      baseURL: `${baseUrl}/api/v1`,
      headers,
    });
  }

  async getVideos(limit: number = 20, skip: number = 0): Promise<Video[]> {
    const response = await this.client.get('/media', {
      params: { limit, skip },
    });
    return response.data.results || response.data;
  }

  async getVideo(friendlyToken: string): Promise<Video> {
    const response = await this.client.get(`/media/${friendlyToken}`);
    return response.data;
  }

  async searchVideos(query: string, limit: number = 20): Promise<Video[]> {
    const response = await this.client.get('/search', {
      params: { q: query, limit },
    });
    return response.data.results || response.data;
  }

  async getPlaylists(): Promise<Playlist[]> {
    const response = await this.client.get('/playlists');
    return response.data.results || response.data;
  }

  async getPlaylist(friendlyToken: string): Promise<Playlist> {
    const response = await this.client.get(`/playlists/${friendlyToken}`);
    return response.data;
  }

  async getUserInfo(): Promise<User> {
    const response = await this.client.get('/whoami');
    return response.data;
  }

  // Helper to get video stream URL
  getVideoStreamUrl(video: Video): string {
    // Try to get the best quality stream URL
    if (video.encodings_info?.original_media_url) {
      return video.encodings_info.original_media_url;
    }
    return `${this.baseUrl}${video.url}`;
  }
}
