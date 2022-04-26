#!/bin/sh

set -e

# Log timestamp
date -u

ORIGIN=$1
API_SECRET_KEY=$2

# Get ids for all users in db
json=`curl -s -H "Authorization: Basic $API_SECRET_KEY" -X GET  "$ORIGIN/api/sync/recently-played"`

echo "synced"
echo
