#!/usr/bin/env bash

# Usage:
#   ./build.sh --sha <sha> [--push] [--latest] [--all-platforms]
#
#   --sha <sha>         The short git SHA to use as the image tag (required)
#   --push              Push the image to the registry
#   --latest            Also tag the image as 'latest'
#   --all-platforms     Build for linux/amd64, linux/arm/v7, linux/arm64/v8

IMAGE_NAME="ghcr.io/alex-zissis/home-assistant-matter-hub"
DOCKER_PUSH="false"
TAG_LATEST="false"
PLATFORMS=""
SHA=""

while test $# -gt 0
  do
    case "$1" in
        --push) DOCKER_PUSH="true"
            ;;
        --latest) TAG_LATEST="true"
            ;;
        --all-platforms) PLATFORMS="linux/amd64,linux/arm/v7,linux/arm64/v8"
            ;;
        --sha)
            shift
            SHA="$1"
            ;;
    esac
    shift
  done

if [ -z "$SHA" ]; then
  echo "Error: --sha <sha> argument is required."
  exit 1
fi

TAGS=("$IMAGE_NAME:$SHA")
if [ "$TAG_LATEST" = "true" ]; then
  TAGS+=("$IMAGE_NAME:latest")
fi

DOCKER_BUILD_ARGS=()
for TAG in "${TAGS[@]}"; do
  DOCKER_BUILD_ARGS+=("-t" "$TAG")
done

if [ "$DOCKER_PUSH" = "true" ]; then
  DOCKER_BUILD_ARGS+=("--push")
fi
if [ -n "$PLATFORMS" ]; then
  DOCKER_BUILD_ARGS+=("--platform=$PLATFORMS")
fi

echo "#######################################################################################"
echo "Building $IMAGE_NAME:$SHA"
echo "#######################################################################################"

docker buildx build \
  "${DOCKER_BUILD_ARGS[@]}" \
  .
