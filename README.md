# MediaCMS Mobile App

A progressive mobile web app for browsing and streaming videos from MediaCMS instances.

## Features

- 🎬 Browse and stream videos from any MediaCMS instance
- 🔍 Search videos across your instance
- 👤 Guest browsing or authenticated access
- 📱 Mobile-optimized dark theme (YouTube-inspired)
- 📚 Watch history and playlists
- 🌐 Multi-instance support

## Quick Start with Docker

### Prerequisites
- Docker 20.10 or higher

### Build and Run

**Option 1: Using the deployment script (Recommended)**

```bash
# Make the script executable
chmod +x deploy.sh

# Deploy the app
./deploy.sh deploy

# Access at http://localhost:8080
```

**Option 2: Manual Docker commands**

```bash
# Build from project root (where Dockerfile is)
docker build -t mediacms-mobile:latest .

# Run the container
docker run -d -p 8080:80 --name mediacms-mobile mediacms-mobile:latest

# Access at http://localhost:8080
```

### Other Commands

```bash
# View logs
./deploy.sh logs

# Stop the app
./deploy.sh stop

# Restart the app
./deploy.sh restart

# Check status
./deploy.sh status

# Clean up
./deploy.sh clean
```

## Development Setup

If you want to run in development mode:

```bash
cd frontend
yarn install
yarn start
```

## Testing the App

1. Open http://localhost:8080 (or your configured port)
2. Click "Add New Instance"
3. Enter a MediaCMS instance URL (e.g., `demo.mediacms.io`)
4. Choose to browse as guest or sign in
5. Start browsing videos!

## Documentation

- **[APP_DOCUMENTATION.md](APP_DOCUMENTATION.md)** - Complete app features and API integration
- **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)** - Detailed Docker deployment guide
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Quick deployment reference

## Project Structure

```
/app
├── Dockerfile              # Production Docker build
├── .dockerignore          # Docker build exclusions
├── deploy.sh              # Deployment script
├── frontend/              # Expo mobile app
│   ├── app/              # App screens and navigation
│   ├── components/       # Reusable components
│   ├── services/         # API services
│   ├── store/            # State management (Zustand)
│   └── types/            # TypeScript types
└── backend/              # Backend API (optional)
```

## Tech Stack

- **Frontend**: Expo (React Native + React Native Web)
- **Navigation**: Expo Router + React Navigation
- **State**: Zustand + AsyncStorage
- **API**: Axios
- **Video**: expo-av
- **Deployment**: Docker + Nginx

## Troubleshooting

### Docker Build Fails

Make sure you're building from the project root directory:

```bash
cd /path/to/project  # Where Dockerfile is located
docker build -t mediacms-mobile:latest .
```

### Port Already in Use

Use a different port:

```bash
PORT=3000 ./deploy.sh start
# or
docker run -d -p 3000:80 --name mediacms-mobile mediacms-mobile:latest
```

### App Not Loading

Check if container is running:

```bash
docker ps | grep mediacms-mobile
```

View logs:

```bash
docker logs mediacms-mobile
```

## Production Deployment

For production with resource limits and auto-restart:

```bash
docker run -d \
  --name mediacms-mobile \
  -p 80:80 \
  --restart unless-stopped \
  --memory="1g" \
  --cpus="1.0" \
  mediacms-mobile:latest
```

## Support

- Check logs: `./deploy.sh logs` or `docker logs mediacms-mobile`
- Verify health: `curl http://localhost:8080/health`
- Review documentation in the docs folder

## License

This is a demo application for MediaCMS integration.

---

**Need help?** See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for detailed instructions.
