#!/bin/sh

# Load environment variables
export $(egrep -v '^#' .env | xargs)

# Add node_modules/.bin to PATH
PATH=$PATH:node_modules/.bin

# Sentry organization & project
ORG=wwdcscholars
PRJ=app

# Base URL
URL=https://www.wwdcscholars.com

# Get version (current tag)
VERSION=app@`git describe --tags`

if [ "$NODE_ENV" = "production" ]; then
  BASE_URL="$PROD_BASE_URL"
elif [ "$NODE_ENV" = "staging" ]; then
  BASE_URL="$STAGE_BASE_URL"
else
  echo "Neither production nor staging environment, skipping sentry release."
  exit 1
fi

# Create new version in sentry
sentry-cli releases -o $ORG -p $PRJ new --finalize $VERSION
sentry-cli releases -o $ORG -p $PRJ set-commits --auto $VERSION
sentry-cli releases -o $ORG -p $PRJ files $VERSION upload-sourcemaps --no-rewrite --url-prefix "https://$BASE_URL" ./dist
