#!/usr/bin/env bash
# Vercel Ignored Build Step. 종료코드 0이면 빌드를 건너뛰고, 1이면 빌드한다.
# 사용: bash ../../scripts/vercel-ignore-build.sh apps/image-blur
set -u

APP_DIR="${1:?앱 디렉터리를 인자로 넘겨야 한다}"

# libs와 의존성이 바뀌면 모든 앱이 영향을 받는다
SHARED_PATHS=(libs package.json yarn.lock .yarnrc.yml)

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "git 저장소가 아니다. 빌드한다."; exit 1; }
cd "$ROOT"

BASE="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$BASE" ] && git rev-parse --verify --quiet HEAD^ >/dev/null; then
  BASE="HEAD^"
fi

# 비교 기준을 못 찾으면 건너뛰지 않는다. 빌드해야 하는데 건너뛰는 쪽이 더 위험하다
if [ -z "$BASE" ]; then
  echo "비교할 이전 커밋이 없다. 빌드한다."
  exit 1
fi

if git diff --quiet "$BASE" HEAD -- "$APP_DIR" "${SHARED_PATHS[@]}"; then
  echo "$APP_DIR 와 공유 자원에 변경이 없다. 빌드를 건너뛴다."
  exit 0
fi

echo "변경이 있다. 빌드한다."
exit 1
