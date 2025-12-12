# Docker Deployment Guide

This guide explains how to build and deploy the MediaCMS Mobile App using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- At least 2GB of free disk space for the image

## Quick Start

### Build the Docker Image

**Important:** Build from the project root directory (where Dockerfile is located)

```bash
# Make sure you're in the project root
cd /path/to/project

# Build the image
docker build -t mediacms-mobile:latest .
```

### Run the Container

```bash
docker run -d \
  --name mediacms-mobile \
  -p 8080:80 \
  --restart unless-stopped \
  mediacms-mobile:latest
```

The app will be available at: **http://localhost:8080**

## Docker Commands

### Build

Build the production image:
```bash
docker build -t mediacms-mobile:latest .
```

Build with a custom tag:
```bash
docker build -t mediacms-mobile:v1.0.0 .
```

Build with no cache (fresh build):
```bash
docker build --no-cache -t mediacms-mobile:latest .
```

### Run

Run on default port (8080):
```bash
docker run -d -p 8080:80 --name mediacms-mobile mediacms-mobile:latest
```

Run on custom port (e.g., 3000):
```bash
docker run -d -p 3000:80 --name mediacms-mobile mediacms-mobile:latest
```

Run with custom name:
```bash
docker run -d -p 8080:80 --name my-mediacms-app mediacms-mobile:latest
```

### Manage Container

Stop the container:
```bash
docker stop mediacms-mobile
```

Start the container:
```bash
docker start mediacms-mobile
```

Restart the container:
```bash
docker restart mediacms-mobile
```

Remove the container:
```bash
docker rm mediacms-mobile
```

View logs:
```bash
docker logs mediacms-mobile
```

Follow logs in real-time:
```bash
docker logs -f mediacms-mobile
```

Inspect container:
```bash
docker inspect mediacms-mobile
```

### Health Check

Check container health:
```bash
docker inspect --format='{{.State.Health.Status}}' mediacms-mobile
```

Access health endpoint directly:
```bash
curl http://localhost:8080/health
```

## Image Management

### View Images

```bash
docker images | grep mediacms-mobile
```

### Remove Image

```bash
docker rmi mediacms-mobile:latest
```

### Tag Image for Registry

```bash
docker tag mediacms-mobile:latest your-registry/mediacms-mobile:latest
```

### Push to Registry

```bash
docker push your-registry/mediacms-mobile:latest
```

## Production Deployment

### Recommended Run Command

```bash
docker run -d \
  --name mediacms-mobile \
  -p 80:80 \
  --restart unless-stopped \
  --memory="512m" \
  --cpus="0.5" \
  mediacms-mobile:latest
```

### Environment-Specific Deployment

**Development:**
```bash
docker run -d \
  --name mediacms-mobile-dev \
  -p 8080:80 \
  mediacms-mobile:latest
```

**Staging:**
```bash
docker run -d \
  --name mediacms-mobile-staging \
  -p 8081:80 \
  --restart unless-stopped \
  mediacms-mobile:latest
```

**Production:**
```bash
docker run -d \
  --name mediacms-mobile-prod \
  -p 80:80 \
  --restart always \
  --memory="1g" \
  --cpus="1.0" \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  mediacms-mobile:latest
```

## Docker Image Details

### What's Inside

- **Base Image**: nginx:alpine (lightweight ~40MB)
- **Node Version**: 18 (build stage only)
- **Web Server**: Nginx
- **App Build**: Optimized production build
- **Compression**: Gzip enabled
- **Caching**: Static assets cached for 1 year
- **Health Check**: Built-in health endpoint

### Image Size

- Build stage: ~500MB (not included in final image)
- Final image: ~60-80MB (depends on app size)

### Ports

- Container Port: 80 (Nginx)
- Default Host Port: 8080 (configurable)

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker logs mediacms-mobile
```

Verify image:
```bash
docker images mediacms-mobile
```

### Port Already in Use

Find what's using the port:
```bash
lsof -i :8080
```

Use a different port:
```bash
docker run -d -p 9090:80 --name mediacms-mobile mediacms-mobile:latest
```

### Build Fails

Clean Docker build cache:
```bash
docker builder prune -a
```

Rebuild with no cache:
```bash
docker build --no-cache -t mediacms-mobile:latest .
```

### App Not Loading

Check if container is running:
```bash
docker ps | grep mediacms-mobile
```

Check health status:
```bash
curl http://localhost:8080/health
```

Inspect Nginx logs inside container:
```bash
docker exec mediacms-mobile cat /var/log/nginx/error.log
```

### Memory Issues

Increase memory limit:
```bash
docker run -d --memory="1g" -p 8080:80 mediacms-mobile:latest
```

### Permissions Issues

Run with specific user:
```bash
docker run -d --user nginx -p 8080:80 mediacms-mobile:latest
```

## Advanced Configuration

### Custom Nginx Config

Create custom config and mount it:
```bash
docker run -d \
  -v /path/to/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  -p 8080:80 \
  mediacms-mobile:latest
```

### SSL/TLS (HTTPS)

For production, use a reverse proxy like Traefik or Nginx Proxy:

```bash
docker run -d \
  --name mediacms-mobile \
  -p 8080:80 \
  --label "traefik.enable=true" \
  --label "traefik.http.routers.mediacms.rule=Host(\`app.example.com\`)" \
  --label "traefik.http.routers.mediacms.tls=true" \
  mediacms-mobile:latest
```

### Network Configuration

Create custom network:
```bash
docker network create mediacms-network
docker run -d --network mediacms-network --name mediacms-mobile mediacms-mobile:latest
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Build Docker image
  run: docker build -t mediacms-mobile:${{ github.sha }} .

- name: Run container
  run: docker run -d -p 8080:80 mediacms-mobile:${{ github.sha }}
```

### GitLab CI Example

```yaml
build:
  script:
    - docker build -t mediacms-mobile:$CI_COMMIT_SHA .
    - docker push mediacms-mobile:$CI_COMMIT_SHA
```

## Performance Tips

1. **Use specific port binding** instead of automatic mapping
2. **Set memory limits** to prevent resource exhaustion
3. **Use restart policies** for automatic recovery
4. **Enable log rotation** to prevent disk fill
5. **Monitor health checks** for reliability

## Security Considerations

1. **Run as non-root user** (already configured in Dockerfile)
2. **Keep base images updated**: `docker pull nginx:alpine`
3. **Scan for vulnerabilities**: `docker scan mediacms-mobile:latest`
4. **Use read-only file system** where possible
5. **Limit container capabilities**: `--cap-drop=ALL`

## Monitoring

### Resource Usage

```bash
docker stats mediacms-mobile
```

### Container Events

```bash
docker events --filter container=mediacms-mobile
```

## Backup and Restore

Since this is a static web app, no data backup is needed. Simply rebuild the image from source when needed.

## Support

For issues related to:
- **Docker build**: Check build logs and dependencies
- **Runtime errors**: Check container logs
- **Network issues**: Verify port mappings and firewall rules
- **App functionality**: See main README.md and APP_DOCUMENTATION.md
