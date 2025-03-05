# syntax=docker/dockerfile:1

FROM node:20.17.0-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm i

# Copy source code
COPY . .

# Build the application
RUN npm run build -- --base-href /

FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist/collection-center/browser /usr/share/nginx/html

# Copy the entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create assets directory
RUN mkdir -p /usr/share/nginx/html/assets

# Expose port
EXPOSE 80

# Set environment variables with defaults
ENV PRODUCTION=false \
    API_URL=/agro-api/collection-center-api \
    AUTH_URL=/agro-api/auth \
    MARKET_PRICE_URL=/agro-api/market-price

ENTRYPOINT ["/docker-entrypoint.sh"]
