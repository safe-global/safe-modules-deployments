#!/usr/bin/env bash
#
# For each module deployment JSON file changed in a PR, diffs it against the PR's base
# commit to find which chain ID(s) were added/changed, then verifies each one's bytecode
# against an already-registered (unchanged) reference chain in the same file.
#
# USAGE
#     bash ./bin/github-review.sh <PR>

set -euo pipefail

usage() {
    cat <<EOF
This script verifies deployment bytecode consistency for the asset files changed in a PR.

USAGE
    bash ./bin/github-review.sh <PR>

ARGUMENTS
    PR          The GitHub PR number

EXAMPLES
    bash ./bin/github-review.sh 123
EOF
}

if ! command -v gh &> /dev/null; then
    echo "ERROR: Please install the 'gh' GitHub CLI" 1>&2
    exit 1
fi

if [[ "$#" -ne 1 ]]; then
    echo "ERROR: Invalid number of arguments" 1>&2
    usage
    exit 1
fi
if ! [[ $1 =~ ^[0-9]+$ ]]; then
    echo "ERROR: $1 is not a valid GitHub PR number" 1>&2
    exit 1
fi
pr=$1

if ! pr_state="$(gh pr view "$pr" --json state --jq '.state' 2>/dev/null)"; then
    echo "ERROR: PR #$pr does not exist in this repository" 1>&2
    exit 1
fi
if [[ "$pr_state" != "OPEN" ]]; then
    echo "ERROR: PR #$pr is not open (current state: $pr_state)" 1>&2
    exit 1
fi

base_sha="$(gh pr view "$pr" --json baseRefOid --jq '.baseRefOid')"
if [[ -z "$base_sha" ]]; then
    echo "ERROR: Could not determine base commit for PR #$pr" 1>&2
    exit 1
fi
git fetch origin "$base_sha" --depth=1 2>/dev/null || true

files="$(gh pr diff "$pr" --name-only | grep -E '^src/assets/.*\.json$' || true)"
if [[ -z "$files" ]]; then
    echo "No src/assets/*.json files changed in PR #$pr, nothing to review."
    exit 0
fi

# Assume that if `GITHUB_HEAD_REF` is set, we're running in CI and the PR's files are
# already checked out; otherwise apply the patch locally on top of the current branch.
applied_patch=0
if [[ -z "${GITHUB_HEAD_REF:-}" ]]; then
    gh pr diff "$pr" --patch | git apply --include 'src/assets/**' --verbose
    applied_patch=1
fi

status=0
while IFS= read -r file; do
    echo "Reviewing $file"
    pnpm run --silent review:verify-deployment "$file" --base "$base_sha" || status=1
done <<< "$files"

if [[ "$applied_patch" -eq 1 ]]; then
    git restore --ignore-unmerged -- src/assets
fi

exit $status
