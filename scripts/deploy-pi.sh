#!/usr/bin/env bash
set -Eeuo pipefail

sha=${1:?Pass the verified commit SHA.}
if [[ ! $sha =~ ^[0-9a-f]{40}$ ]]; then
  echo 'Expected a full commit SHA.' >&2
  exit 1
fi

root=/home/k1taru/srv/IAM-K1taru
releases=/home/k1taru/srv/iam-k1taru-releases
service=iam-k1taru.service
env_file=$root/.env

test -d "$root/.git"
test -f "$env_file"
set -a
. "$env_file"
set +a
if [[ ! ${PORT:-} =~ ^[0-9]+$ || -z ${SITE_URL:-} || ${SITE_INDEXABLE:-} != true ]]; then
  echo 'Set PORT, SITE_URL, and SITE_INDEXABLE=true in the Pi .env file.' >&2
  exit 1
fi
if [[ -n $(git -C "$root" status --porcelain --untracked-files=no) ]]; then
  echo 'The Pi checkout has tracked changes; deployment stopped.' >&2
  exit 1
fi

git -C "$root" fetch --no-tags origin main
if [[ $(git -C "$root" rev-parse refs/remotes/origin/main) != "$sha" ]]; then
  echo 'A newer main commit is available; skipping this deployment.'
  exit 0
fi

if [[ -s $HOME/.nvm/nvm.sh ]]; then
  set +u
  . "$HOME/.nvm/nvm.sh"
  nvm use 26 >/dev/null
  set -u
fi
case $(node --version) in
  v26.*) ;;
  *) echo 'Node.js 26 is required on the Pi.' >&2; exit 1 ;;
esac

stage=$(mktemp -d)
incoming=
cleanup() {
  git -C "$root" worktree remove --force "$stage" >/dev/null 2>&1 || true
  if [[ -n $incoming && -d $incoming ]]; then rm -rf "$incoming"; fi
}
trap cleanup EXIT

git -C "$root" worktree add --detach "$stage" "$sha"
(
  cd "$stage/Client"
  npm ci
  npm run build
)
test -f "$stage/Client/out/index.html"

mkdir -p "$releases"
release=$releases/$sha
if [[ ! -e $release ]]; then
  incoming=$(mktemp -d "$releases/.incoming.XXXXXX")
  cp -a "$stage/Client/out" "$incoming/out"
  mv "$incoming" "$release"
  incoming=
fi
test -f "$release/out/index.html"

git -C "$root" fetch --no-tags origin main
if [[ $(git -C "$root" rev-parse refs/remotes/origin/main) != "$sha" ]]; then
  echo 'A newer main commit arrived during the build; skipping this deployment.'
  exit 0
fi

previous_sha=$(git -C "$root" rev-parse HEAD)
git -C "$root" switch main
git -C "$root" merge --ff-only "$sha"

previous_out=$(readlink "$root/Client/out" || true)
if [[ -z $previous_out && -d $root/Client/out ]]; then
  legacy=$(mktemp -d "$releases/legacy.XXXXXX")
  mv "$root/Client/out" "$legacy/out"
  previous_out=$legacy/out
fi

switch_out() {
  local link=$root/Client/out.next.$$
  ln -s "$1" "$link"
  mv -Tf "$link" "$root/Client/out"
}

switch_out "$release/out"
if sudo -n systemctl restart "$service" && \
  curl --fail --silent --show-error --retry 5 --retry-delay 1 --retry-connrefused \
    "http://127.0.0.1:$PORT/" >/dev/null; then
  echo "Deployed $sha to the Raspberry Pi."
else
  echo 'Deployment health check failed; restoring the previous release.' >&2
  if [[ -n $previous_out ]]; then
    switch_out "$previous_out"
    git -C "$root" reset --hard "$previous_sha"
    sudo -n systemctl restart "$service" || true
  fi
  exit 1
fi
