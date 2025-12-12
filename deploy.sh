#!/bin/bash

# MediaCMS Mobile App - Docker Deployment Script
# Usage: ./deploy.sh [build|start|stop|restart|logs|clean]

set -e

IMAGE_NAME="mediacms-mobile"
CONTAINER_NAME="mediacms-mobile"
PORT="${PORT:-8080}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Build the Docker image
build() {
    print_info "Building Docker image..."
    docker build -t ${IMAGE_NAME}:latest .
    print_success "Image built successfully!"
}

# Start the container
start() {
    # Check if container already exists
    if docker ps -a | grep -q ${CONTAINER_NAME}; then
        print_info "Container already exists. Starting..."
        docker start ${CONTAINER_NAME}
    else
        print_info "Creating and starting new container..."
        docker run -d \
            --name ${CONTAINER_NAME} \
            -p ${PORT}:80 \
            --restart unless-stopped \
            ${IMAGE_NAME}:latest
    fi
    
    print_success "Container started!"
    print_info "App available at: http://localhost:${PORT}"
    print_info "Health check: http://localhost:${PORT}/health"
}

# Stop the container
stop() {
    print_info "Stopping container..."
    docker stop ${CONTAINER_NAME} || print_error "Container not running"
    print_success "Container stopped!"
}

# Restart the container
restart() {
    print_info "Restarting container..."
    docker restart ${CONTAINER_NAME}
    print_success "Container restarted!"
}

# View logs
logs() {
    docker logs -f ${CONTAINER_NAME}
}

# Clean up everything
clean() {
    print_info "Cleaning up..."
    
    # Stop and remove container
    if docker ps -a | grep -q ${CONTAINER_NAME}; then
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm ${CONTAINER_NAME} 2>/dev/null || true
        print_success "Container removed"
    fi
    
    # Remove image
    if docker images | grep -q ${IMAGE_NAME}; then
        docker rmi ${IMAGE_NAME}:latest 2>/dev/null || true
        print_success "Image removed"
    fi
    
    print_success "Cleanup complete!"
}

# Status check
status() {
    print_info "Checking status..."
    
    if docker ps | grep -q ${CONTAINER_NAME}; then
        print_success "Container is running"
        echo ""
        docker ps --filter name=${CONTAINER_NAME} --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        
        # Check health
        HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT}/health 2>/dev/null || echo "000")
        if [ "$HEALTH" = "200" ]; then
            print_success "Health check passed"
        else
            print_error "Health check failed"
        fi
    else
        print_error "Container is not running"
    fi
}

# Full deployment (build + start)
deploy() {
    print_info "Starting full deployment..."
    build
    stop 2>/dev/null || true
    docker rm ${CONTAINER_NAME} 2>/dev/null || true
    start
    print_success "Deployment complete!"
}

# Show help
help() {
    cat << EOF
MediaCMS Mobile App - Docker Deployment Script

Usage: ./deploy.sh [command]

Commands:
    build       Build the Docker image
    start       Start the container
    stop        Stop the container
    restart     Restart the container
    logs        View container logs (follow mode)
    status      Check container status
    clean       Remove container and image
    deploy      Full deployment (build + start)
    help        Show this help message

Environment Variables:
    PORT        Port to expose (default: 8080)

Examples:
    ./deploy.sh build
    ./deploy.sh start
    PORT=3000 ./deploy.sh start
    ./deploy.sh logs

EOF
}

# Main script logic
case "$1" in
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    deploy)
        deploy
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        help
        exit 1
        ;;
esac
