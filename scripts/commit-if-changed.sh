#!/usr/bin/env bash
# commit-if-changed.sh
#
# This script stages and commits all changes if there are any. It configures
# the git user each time it runs. The commit message includes [skip ci] to
# prevent GitHub Actions from re-triggering itself in an infinite loop.

set -euo pipefail

# Set bot identity. Adjust the email to something appropriate for your repo.
git config user.name "automation-bot"
git config user.email "bot@example.invalid"

# Only commit if there are changes
if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "chore: daily heartbeat [skip ci]"
  git push
else
  echo "No changes detected – nothing to commit."
fi