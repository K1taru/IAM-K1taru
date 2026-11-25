#!/usr/bin/env bash
set -Eeuo pipefail

root=/home/k1taru/srv/IAM-K1taru
GITHUB_READ_TOKEN=$(< /home/k1taru/srv/.iam-k1taru-github-token)
export GITHUB_READ_TOKEN

if [[ -s $HOME/.nvm/nvm.sh ]]; then
  set +u
  . "$HOME/.nvm/nvm.sh"
  nvm use 26 >/dev/null
  set -u
fi

node "$root/scripts/poll-deploy-pi.mjs"
