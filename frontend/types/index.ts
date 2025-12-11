// MediaCMS Types

export interface MediaCMSInstance {
  id: string;
  name: string;
  url: string;
  username?: string;
  token?: string;
}

export interface Video {
  friendly_token: string;
  title: string;
  description: string;
  thumbnail_url: string;
  thumbnail_time: string;
  url: string;
  author: string;
  views: number;
  duration: number;
  add_date: string;
  edit_date: string;
  media_type: string;
  state: string;
  encodings_info?: {
    original_media_url?: string;
    [key: string]: any;
  };
}

export interface User {
  username: string;
  email: string;
  name: string;
  description?: string;
  thumbnail?: string;
}

export interface Playlist {
  friendly_token: string;
  title: string;
  description: string;
  media_count: number;
  thumbnail?: string;
}

export interface SearchResult {
  results: Video[];
  count: number;
}
