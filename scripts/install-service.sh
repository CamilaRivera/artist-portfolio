#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

mode="${1:-install}"
if (( $# > 1 )) || [[ "$mode" != install && "$mode" != --print ]]; then
  fail 'Usage: bash scripts/install-service.sh [--print]'
fi

if (( EUID == 0 )); then
  fail 'Run this script as the non-root application user, without sudo. It uses sudo only to install and enable the service.'
fi

app_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
app_user="$(id -un)"
app_group="$(id -gn)"
command -v node >/dev/null || fail 'Node.js is not on PATH. Run nvm use first if using nvm.'
node_bin="$(node -p 'process.execPath')"
node_bin_dir="$(dirname -- "$node_bin")"

node -e '
  const [major, minor] = process.versions.node.split(".").map(Number);
  process.exit(major === 24 && minor >= 15 ? 0 : 1);
' || fail 'This project requires Node.js >=24.15.0 and <25. Run nvm install and nvm use.'

[[ -f "$app_dir/dist/main.js" ]] || fail 'Production build is missing. Run npm ci and npm run build first.'
[[ -d "$app_dir/node_modules/@nestjs/core" ]] || fail 'Dependencies are missing. Run npm ci first.'
[[ -r "$app_dir/config/production.env" ]] || fail 'config/production.env must exist and be readable by the application user.'

# Restrict substituted values to characters that need no systemd escaping.
for path in "$app_dir" "$node_bin"; do
  [[ "$path" =~ ^/[a-zA-Z0-9_./-]+$ ]] || fail 'Application and Node paths must use only letters, digits, underscores, dots, slashes, and hyphens.'
done
for account in "$app_user" "$app_group"; do
  [[ "$account" =~ ^[a-zA-Z_][a-zA-Z0-9_-]*\$?$ ]] || fail 'Unsupported user or group name.'
done

unit="$(cat "$app_dir/deploy/artist-portfolio.service")"
unit="${unit//@APP_USER@/$app_user}"
unit="${unit//@APP_GROUP@/$app_group}"
unit="${unit//@APP_DIR@/$app_dir}"
unit="${unit//@NODE_BIN@/$node_bin}"
unit="${unit//@NODE_BIN_DIR@/$node_bin_dir}"

if [[ "$mode" == --print ]]; then
  printf '%s\n' "$unit"
  exit 0
fi

command -v systemctl >/dev/null || fail 'systemctl is required. Install this service on the Ubuntu server.'
command -v systemd-analyze >/dev/null || fail 'systemd-analyze is required to verify the service.'
command -v sudo >/dev/null || fail 'sudo is required to install the system service.'

unit_dir="$(mktemp -d)"
trap 'rm -rf -- "$unit_dir"' EXIT
printf '%s\n' "$unit" > "$unit_dir/artist-portfolio.service"
systemd-analyze verify "$unit_dir/artist-portfolio.service"
sudo install -o root -g root -m 0644 "$unit_dir/artist-portfolio.service" /etc/systemd/system/artist-portfolio.service
sudo systemctl daemon-reload
sudo systemctl enable artist-portfolio.service
# restart also starts an inactive service and applies updated paths on reinstall.
sudo systemctl restart artist-portfolio.service
sudo systemctl --no-pager --full status artist-portfolio.service
