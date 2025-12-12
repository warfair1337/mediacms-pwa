# MediaCMS Mobile App

A progressive mobile web app for MediaCMS with a modern, dark theme design inspired by YouTube. Built with Expo, React Native, and TypeScript.

## Features

### ✅ Implemented
- **Connection Manager**: Add, remove, and manage multiple MediaCMS instances
- **Authentication**: Login with username/password using MediaCMS native auth
- **Video Playback**: Stream videos with native controls using expo-av
- **Search**: Search videos across your MediaCMS instance
- **Watch History**: Track watched videos locally
- **Playlists**: View playlists from MediaCMS
- **Profile**: View user info, switch instances, logout
- **Dark Theme**: Modern UI with YouTube-inspired design (#0F0F0F background, #FF0000 primary)

### 📱 Navigation
- **Home Tab**: Browse featured/recent videos
- **Search Tab**: Search videos by keyword
- **Library Tab**: Watch history and playlists
- **Profile Tab**: User settings and instance management

## Tech Stack

### Frontend
- **Framework**: Expo (React Native)
- **Navigation**: Expo Router (file-based routing) + React Navigation
- **State Management**: Zustand
- **Storage**: AsyncStorage (for instances and watch history)
- **HTTP Client**: Axios
- **Video Player**: expo-av

### Backend
- **Not required**: App connects directly to MediaCMS instances
- The backend is a placeholder for future enhancements

## App Structure

```
/app/frontend/
├── app/
│   ├── (tabs)/              # Main tabs
│   │   ├── _layout.tsx      # Tab navigation
│   │   ├── home.tsx         # Home/Video feed
│   │   ├── search.tsx       # Search videos
│   │   ├── library.tsx      # History & playlists
│   │   └── profile.tsx      # User profile
│   ├── video/
│   │   └── [id].tsx         # Video player screen
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Entry/splash screen
│   ├── connection-manager.tsx
│   └── add-instance.tsx
├── components/
│   ├── VideoCard.tsx        # Video thumbnail card
│   └── InstanceCard.tsx     # Instance list item
├── store/
│   └── useStore.ts          # Zustand global state
├── services/
│   └── api.ts               # MediaCMS API service
└── types/
    └── index.ts             # TypeScript types
```

## Getting Started

### Option 1: Docker (Recommended for Production)

**Prerequisites:**
- Docker 20.10+

**Build and Run:**
```bash
# Build the image
docker build -t mediacms-mobile:latest .

# Run the container
docker run -d -p 8080:80 --name mediacms-mobile mediacms-mobile:latest

# Access at http://localhost:8080
```

**For detailed Docker instructions, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)**

### Option 2: Development Mode

**Prerequisites:**
- Node.js 18+ and Yarn
- Expo Go app (for mobile testing)

**Installation:**
```bash
cd /app/frontend
yarn install
```

**Running the App:**
```bash
yarn start
```

The app will open in:
- **Web**: Browser preview
- **Mobile**: Scan QR code with Expo Go app

### Using the Demo Instance

1. Open the app
2. Tap "Add New Instance"
3. Enter:
   - **Instance URL**: demo.mediacms.io
   - **Username**: Your MediaCMS username
   - **Password**: Your password
4. Tap "Connect & Login"

## MediaCMS API Integration

The app uses MediaCMS REST API v1:

### Authentication
- **Login**: `POST /api/v1/login`
- **Get Token**: `GET /api/v1/user/token`
- **User Info**: `GET /api/v1/whoami`

### Videos
- **List Videos**: `GET /api/v1/media`
- **Video Details**: `GET /api/v1/media/{friendly_token}`
- **Search**: `GET /api/v1/search?q={query}`

### Playlists
- **List Playlists**: `GET /api/v1/playlists`
- **Playlist Details**: `GET /api/v1/playlists/{friendly_token}`

All API requests use Bearer token authentication:
```
Authorization: Bearer {token}
```

## Design System

### Colors
- **Background**: #0F0F0F (dark)
- **Surface**: #1F1F1F
- **Surface Alt**: #2A2A2A
- **Primary**: #FF0000 (YouTube red)
- **Text**: #FFFFFF
- **Text Secondary**: #AAAAAA
- **Text Tertiary**: #666666
- **Border**: #2A2A2A

### Typography
- **Title**: 20px, bold
- **Body**: 16px, regular
- **Caption**: 14px, regular
- **Small**: 12px, regular

### Spacing
- Uses 8pt grid: 8px, 16px, 24px, 32px

## Known Issues & Limitations

1. **Video Playback**: Depends on MediaCMS encoding and stream availability
2. **Offline Mode**: Not supported (online streaming only)
3. **Upload**: Not implemented in current version
4. **Comments**: Read-only (not yet implemented)

## Future Enhancements

- [ ] Upload videos
- [ ] Comment on videos
- [ ] Create/edit playlists
- [ ] Download videos for offline viewing
- [ ] Push notifications
- [ ] Share videos
- [ ] Multiple quality options
- [ ] Picture-in-picture mode

## Testing

To test the app with demo.mediacms.io:

1. You need a valid account on demo.mediacms.io
2. The demo instance may have rate limits
3. Video playback depends on internet connection

## Mobile Considerations

- **Touch Targets**: Minimum 44px for iOS, 48px for Android
- **Safe Areas**: Uses SafeAreaView for notch/home indicator
- **Keyboard**: Proper KeyboardAvoidingView handling
- **Navigation**: Smooth transitions and back button support
- **Performance**: Optimized with FlatList virtualization

## Troubleshooting

### Login Failed
- Verify instance URL (no http/https needed)
- Check username and password
- Ensure instance is accessible

### Videos Not Loading
- Check internet connection
- Verify instance is running
- Check MediaCMS API is accessible

### Video Won't Play
- Check video encoding
- Verify video URL is accessible
- Try a different video

## Development

### Adding a New Screen
1. Create file in `/app/` directory
2. Expo Router automatically creates route
3. Access via `router.push('/screen-name')`

### Adding a New API Method
1. Add method to `services/api.ts`
2. Update types in `types/index.ts`
3. Call from component using the API service

### State Management
- Use Zustand store for global state
- AsyncStorage for persistence
- Local state for UI-only state

## License

This is a demo application for MediaCMS integration.
