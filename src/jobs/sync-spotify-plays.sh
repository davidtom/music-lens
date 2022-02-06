#!/bin/sh

set -e

# TODO: should this be a node script? or a "fun" chance to learn bash?

# Log timestamp
date -u

# Get ids for all users in db
json=`curl -s -H "Authorization: Basic c3lzdGVtOm1hbmFnZQ==" -X GET  "http://localhost:8080/api/users"`

# Trigger a sync for each user
# TODO: confirm this fails correctly
for id in `echo "${json}" | jq -r '.[].id'`; do
  echo "Requesting for userId: ${id}"
  results=`curl --silent --show-error -f -H "Authorization: Basic c3lzdGVtOm1hbmFnZQ==" -X GET  "http://localhost:8080/api/sync/recently-played/${id}"; echo`
  echo "New plays: `echo ${results} | jq '.count'`"
done
echo
