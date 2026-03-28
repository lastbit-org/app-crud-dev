#!/bin/sh
# entrypoint.sh - Injeta variáveis de ambiente em runtime no config.js
# Executado pelo container ANTES de iniciar o Nginx

# Se VITE_API_BASE_URL não estiver definida, usa fallback
API_URL="${VITE_API_BASE_URL:-http://localhost:8080}"

# Sanitiza: remove aspas, cifroes e barras invertidas que poderiam injetar código
API_URL=$(printf '%s' "$API_URL" | tr -d '"'\'\\\\)

# Sobrescreve o config.js com o valor real vindo do Cloud Run
cat > /usr/share/nginx/html/config.js << EOF
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_URL}"
};
EOF

echo "Config gerado: API_BASE_URL=${API_URL}"

# Inicia o Nginx normalmente
exec nginx -g "daemon off;"
