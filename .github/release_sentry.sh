#!/bin/sh

# Add node_modules/.bin to PATH
PATH=$PATH:node_modules/.bin

# Sentry organization & project
ORG=wwdcscholars
PRJ=app

# Base URL
URL=https://www.wwdcscholars.com

# Get version (current tag)
VERSION=web-app@`git describe --tags`

# Create new version in sentry
sentry-cli releases -o $ORG -p $PRJ new --finalize $VERSION
sentry-cli releases -o $ORG -p $PRJ set-commits --auto $VERSION
sentry-cli releases -o $ORG -p $PRJ files $VERSION upload-sourcemaps --no-rewrite --url-prefix $URL ./dist
