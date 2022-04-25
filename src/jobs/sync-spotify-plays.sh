#!/bin/sh

set -e

# Log timestamp
date -u

HOSTNAME=$1
API_SECRET_KEY=$2

# Get ids for all users in db
json=`curl -s -H "Authorization: Basic $API_SECRET_KEY" -X GET  "http://$HOSTNAME/api/users"`

# Trigger a sync for each user
# TODO: confirm this fails correctly
for id in `echo "${json}" | jq -r '.[].id'`; do
  echo "Requesting for userId: ${id}"
  results=`curl --silent --show-error -f -H "Authorization: Basic $API_SECRET_KEY" -X GET  "http://$HOSTNAME/api/sync/recently-played/${id}"; echo`
  echo "New plays: `echo ${results} | jq '.count'`"
done
echo
