#!/usr/bin/env bash
set -Eeuo pipefail

# One-command deployment for a dedicated Ubuntu/Debian server.
# Optional variables: DOMAIN, SITE_URL, EMAIL, REPO_URL, APP_NAME.
REPO_URL="${REPO_URL:-https://github.com/yuyongbo01/yubai-notes.git}"
APP_NAME="${APP_NAME:-yubai-notes}"
DOMAIN="${DOMAIN:-_}"
SITE_URL="${SITE_URL:-}"
EMAIL="${EMAIL:-}"
APP_ROOT="/opt/${APP_NAME}"
RELEASES_DIR="${APP_ROOT}/releases"
CURRENT_LINK="${APP_ROOT}/current"
NGINX_SITE="/etc/nginx/sites-available/${APP_NAME}"
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"

if [[ "${EUID}" -ne 0 ]]; then
  echo "请使用 sudo 运行此脚本。" >&2
  exit 1
fi

if [[ ! "${APP_NAME}" =~ ^[a-zA-Z0-9._-]+$ ]]; then
  echo "APP_NAME 只能包含字母、数字、点、下划线和连字符。" >&2
  exit 1
fi

if ! command -v apt-get >/dev/null 2>&1; then
  echo "此脚本仅支持 Ubuntu/Debian（需要 apt-get）。" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git nginx

NODE_MAJOR=0
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
fi
if (( NODE_MAJOR < 22 )); then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

RELEASE_ID="$(date -u +%Y%m%d%H%M%S)"
RELEASE_DIR="${RELEASES_DIR}/${RELEASE_ID}"
install -d -m 0755 "${RELEASES_DIR}"
git clone --depth 1 "${REPO_URL}" "${RELEASE_DIR}"
cd "${RELEASE_DIR}"
npm ci --no-audit --no-fund

if [[ -z "${SITE_URL}" ]]; then
  if [[ "${DOMAIN}" != "_" ]]; then
    SITE_URL="http://${DOMAIN}"
  else
    SERVER_IP="$(hostname -I | awk '{print $1}')"
    SITE_URL="http://${SERVER_IP:-localhost}"
  fi
fi
export NEXT_PUBLIC_SITE_URL="${SITE_URL%/}"
npm run build
test -f dist/server/index.js
chown -R www-data:www-data "${RELEASE_DIR}"
ln -sfn "${RELEASE_DIR}" "${CURRENT_LINK}"

if [[ "${DOMAIN}" == "_" ]]; then
  LISTEN_IPV4="listen 80 default_server;"
  LISTEN_IPV6="listen [::]:80 default_server;"
  rm -f /etc/nginx/sites-enabled/default
else
  LISTEN_IPV4="listen 80;"
  LISTEN_IPV6="listen [::]:80;"
fi

cat >"${NGINX_SITE}" <<EOF
server {
    ${LISTEN_IPV4}
    ${LISTEN_IPV6}
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

cat >"${SERVICE_FILE}" <<EOF
[Unit]
Description=Yubai Notes web application
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=${CURRENT_LINK}
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

ln -sfn "${NGINX_SITE}" "/etc/nginx/sites-enabled/${APP_NAME}"
nginx -t
systemctl daemon-reload
systemctl enable --now "${APP_NAME}"
systemctl restart "${APP_NAME}"
systemctl enable --now nginx
systemctl reload nginx

for _ in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:3000/ >/dev/null; then
    break
  fi
  sleep 1
done
curl -fsS http://127.0.0.1:3000/ >/dev/null

if [[ "${DOMAIN}" != "_" && -n "${EMAIL}" ]]; then
  apt-get install -y certbot python3-certbot-nginx
  certbot --nginx --non-interactive --agree-tos --redirect \
    --email "${EMAIL}" --domain "${DOMAIN}"
fi

CHECK_HOST="${DOMAIN}"
if [[ "${CHECK_HOST}" == "_" ]]; then
  CHECK_HOST="localhost"
fi
curl -fsS -H "Host: ${CHECK_HOST}" http://127.0.0.1/ >/dev/null

echo "部署完成：${SITE_URL%/}"
echo "当前版本：${RELEASE_DIR}"
