#!/bin/sh
# entrypoint.sh - Injeta variáveis de ambiente em runtime
# Executado pelo container ANTES de iniciar o Nginx

# Se VITE_API_BASE_URL não estiver definida, usa fallback local
API_URL="${VITE_API_BASE_URL:-http://localhost:8080}"

# Sanitiza: remove aspas, cifroes e barras invertidas que poderiam injetar código
API_URL=$(printf '%s' "$API_URL" | tr -d '"'\''\\')

# 1) Gera config.js com a URL do backend para uso pelo JavaScript em runtime
cat > /usr/share/nginx/html/config.js << EOF
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_URL}"
};
EOF

echo "Config gerado: API_BASE_URL=${API_URL}"

# 2) Gera os cabeçalhos de segurança do Nginx com o CSP correto para o ambiente
#    connect-src inclui dinamicamente a URL do backend para evitar bloqueio do CSP
cat > /etc/nginx/conf.d/security-headers.conf << EOF
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ${API_URL};" always;
EOF

echo "Security headers gerados com connect-src: ${API_URL}"

# Inicia o Nginx normalmente
exec nginx -g "daemon off;"
