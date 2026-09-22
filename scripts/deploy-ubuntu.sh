#!/usr/bin/env bash
set -Eeuo pipefail

# Lightweight static deployment for Ubuntu/Debian. GitHub Actions builds the
# site; the server only fetches, verifies and serves it with Nginx.
APP_NAME="${APP_NAME:-yubai-notes}"
DOMAIN="${DOMAIN:-_}"
EMAIL="${EMAIL:-}"
BUNDLE_REPO="${BUNDLE_REPO:-https://github.com/yuyongbo01/yubai-notes.git}"
BUNDLE_BRANCH="${BUNDLE_BRANCH:-runtime-static}"
RELEASES_DIR="/var/www/${APP_NAME}-releases"
CURRENT_LINK="/var/www/${APP_NAME}-current"
NGINX_SITE="/etc/nginx/sites-available/${APP_NAME}"
ARCHIVE_NAME="yubai-notes-static.tar.gz"
RELEASE_ID="$(date -u +%Y%m%d%H%M%S)"
RELEASE_DIR="${RELEASES_DIR}/${RELEASE_ID}"
TEMP_DIR=""
DEPLOY_SUCCEEDED=0

cleanup() {
  if [[ -n "${TEMP_DIR}" && -d "${TEMP_DIR}" ]]; then
    rm -rf -- "${TEMP_DIR}"
  fi
  if [[ "${DEPLOY_SUCCEEDED}" -ne 1 && -d "${RELEASE_DIR}" && "${RELEASE_DIR}" == "${RELEASES_DIR}/"* ]]; then
    rm -rf -- "${RELEASE_DIR}"
  fi
}
trap cleanup EXIT

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

MISSING_PACKAGES=()
command -v curl >/dev/null 2>&1 || MISSING_PACKAGES+=(curl)
command -v git >/dev/null 2>&1 || MISSING_PACKAGES+=(git)
command -v nginx >/dev/null 2>&1 || MISSING_PACKAGES+=(nginx)
command -v sha256sum >/dev/null 2>&1 || MISSING_PACKAGES+=(coreutils)
command -v tar >/dev/null 2>&1 || MISSING_PACKAGES+=(tar)
if (( ${#MISSING_PACKAGES[@]} > 0 )); then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get install -y ca-certificates "${MISSING_PACKAGES[@]}"
fi

TEMP_DIR="$(mktemp -d "/tmp/${APP_NAME}.XXXXXX")"
echo "正在通过 Git 获取静态站点包……"
git clone --depth 1 --single-branch --branch "${BUNDLE_BRANCH}" \
  "${BUNDLE_REPO}" "${TEMP_DIR}/bundle"
(
  cd "${TEMP_DIR}/bundle"
  sha256sum --check SHA256SUMS
)

install -d -m 0755 "${RELEASE_DIR}"
tar -xzf "${TEMP_DIR}/bundle/${ARCHIVE_NAME}" -C "${RELEASE_DIR}"
test -f "${RELEASE_DIR}/index.html"
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
    root ${CURRENT_LINK};
    index index.html;

    location /_next/static/ {
        try_files \$uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files \$uri.html \$uri/index.html \$uri =404;
    }
}
EOF

# Remove the old Vinext service if a previous dynamic deployment created it.
if systemctl list-unit-files "${APP_NAME}.service" --no-legend 2>/dev/null | grep -q "${APP_NAME}.service"; then
  systemctl disable --now "${APP_NAME}" || true
fi
rm -f "/etc/systemd/system/${APP_NAME}.service"
systemctl daemon-reload

ln -sfn "${NGINX_SITE}" "/etc/nginx/sites-enabled/${APP_NAME}"
nginx -t
systemctl enable --now nginx
systemctl reload nginx

if [[ "${DOMAIN}" != "_" && -n "${EMAIL}" ]]; then
  if ! command -v certbot >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
  fi
  certbot --nginx --non-interactive --agree-tos --redirect \
    --email "${EMAIL}" --domain "${DOMAIN}"
fi

CHECK_HOST="${DOMAIN}"
if [[ "${CHECK_HOST}" == "_" ]]; then
  CHECK_HOST="localhost"
fi
curl -fsS -H "Host: ${CHECK_HOST}" http://127.0.0.1/ >/dev/null

DEPLOY_SUCCEEDED=1
mapfile -t STALE_RELEASES < <(
  find "${RELEASES_DIR}" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
    | sort -rn | tail -n +4 | cut -d' ' -f2-
)
for stale_release in "${STALE_RELEASES[@]}"; do
  if [[ "${stale_release}" == "${RELEASES_DIR}/"* ]]; then
    rm -rf -- "${stale_release}"
  fi
done

echo "部署完成。"
echo "当前版本：${RELEASE_DIR}"
