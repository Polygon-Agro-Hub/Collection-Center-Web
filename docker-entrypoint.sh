#!/bin/sh

# Create config.json with environment variables
cat > /usr/share/nginx/html/assets/config.json << EOF
{
  "production": ${PRODUCTION:-false},
  "apiUrl": "${API_URL:-/agro-api/collection-center-api}",
  "authUrl": "${AUTH_URL:-/agro-api/auth}",
  "marketPriceUrl": "${MARKET_PRICE_URL:-/agro-api/market-price}"
}
EOF

# Start nginx
nginx -g "daemon off;"
