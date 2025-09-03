# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

New API is a Go-based API gateway and AI asset management system built on top of One API. It provides a unified interface for multiple AI model providers with features like rate limiting, user management, billing, and monitoring.

## Architecture

### Backend (Go)
- **main.go**: Application entry point, initializes resources and starts HTTP server
- **controller/**: HTTP request handlers and business logic
  - `channel.go`: Channel management (AI model providers)
  - `channel-test.go`: Channel testing functionality
  - `billing.go`: Payment and billing operations
- **model/**: Database models and data access layer
  - `channel.go`: Channel data model and operations
  - `log.go`: Logging and audit functionality
  - `ability.go`: Model capabilities management
- **service/**: Business logic and external service integrations
  - `convert.go`: Request format conversion between different AI APIs
  - `channel.go`: Channel operations and routing
  - `error.go`: Error handling and standardization
- **middleware/**: HTTP middleware for authentication, logging, CORS
- **router/**: HTTP routing configuration
- **relay/**: AI API proxy and request forwarding
- **common/**: Shared utilities and constants
- **types/**: Type definitions and data structures

### Frontend (React + Vite)
- **web/**: React frontend built with Vite
- Uses Semi Design UI library (@douyinfe/semi-ui)
- TypeScript support with modern toolchain

## Development Commands

### Backend
```bash
# Run backend development server
go run main.go

# Build backend
go build -o new-api main.go
```

### Frontend
```bash
cd web

# Install dependencies
bun install

# Development server
bun run dev

# Build for production
DISABLE_ESLINT_PLUGIN='true' VITE_REACT_APP_VERSION=$(cat ../VERSION) bun run build

# Linting
bun run lint        # Check formatting with Prettier
bun run lint:fix    # Fix formatting issues
bun run eslint      # Run ESLint
bun run eslint:fix  # Fix ESLint issues
```

### Full Stack Development
```bash
# Build frontend and start backend (from root)
make all

# Or build frontend only
make build-frontend

# Or start backend only
make start-backend
```

## Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
# Using SQLite
docker run --name new-api -d --restart always -p 3000:3000 -e TZ=Asia/Shanghai -v /home/ubuntu/data/new-api:/data calciumion/new-api:latest

# Using MySQL
docker run --name new-api -d --restart always -p 3000:3000 -e SQL_DSN="root:123456@tcp(localhost:3306)/oneapi" -e TZ=Asia/Shanghai -v /home/ubuntu/data/new-api:/data calciumion/new-api:latest
```

## Environment Configuration

Key environment variables (create `.env` file):
- `SQL_DSN`: Database connection string
- `REDIS_CONN_STRING`: Redis connection for caching
- `SESSION_SECRET`: Required for multi-instance deployments
- `CRYPTO_SECRET`: Required for Redis content encryption in multi-instance setups
- `STREAMING_TIMEOUT`: Stream response timeout (default 300s)
- `ERROR_LOG_ENABLED`: Enable error logging (default false)

## Database

- **Default**: SQLite (data stored in `/data` directory)
- **Supported**: MySQL 5.7.8+, PostgreSQL 9.6+
- **ORM**: GORM for database operations
- **Migrations**: Handled automatically on startup

## Key Features Implementation

### Channel Management
- AI provider configurations in `model/channel.go`
- Channel testing in `controller/channel-test.go`
- Load balancing and failover in channel cache system

### Request Format Conversion
- OpenAI Chat Completions ⟷ Claude Messages
- OpenAI Chat Completions ⟷ Gemini Chat
- Implementation in `service/convert.go`

### Billing & Usage Tracking
- Token counting and billing in `controller/billing.go`
- Usage logs in `model/log.go`
- Cached billing with configurable rates

### Multi-tenancy
- User and token management
- Group-based access control
- Model restrictions per user/token

## Code Conventions

- Go modules with semantic import paths (`one-api/...`)
- Standard Go project layout
- GORM for database operations
- Gin framework for HTTP handling
- Structured logging throughout
- Comprehensive error handling with custom error types