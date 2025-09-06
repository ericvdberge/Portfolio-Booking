Automatically checks git status, creates a feature branch, commits changes, and creates a pull request.

```bash
# Check current git status and changes
echo "📋 Current changes:"
git status --short
echo ""

# Prompt for branch name
echo "🌿 Enter a logical branch name (e.g., add-booking-endpoints, fix-auth-bug):"
read -p "Branch name: " BRANCH_NAME

# Validate branch name
if [ -z "$BRANCH_NAME" ]; then
    echo "❌ Branch name cannot be empty"
    exit 1
fi

# Add feature/ prefix if not already present
if [[ ! "$BRANCH_NAME" =~ ^(feature/|bugfix/|hotfix/) ]]; then
    BRANCH_NAME="feature/$BRANCH_NAME"
fi

echo "Creating branch: $BRANCH_NAME"

# Create and switch to new branch
git checkout -b "$BRANCH_NAME"

# Add all changes to staging
git add .

# Prompt for commit message
echo ""
echo "📝 Enter commit message (or press Enter for auto-generated):"
read -p "Commit message: " COMMIT_MSG

# Use auto-generated message if empty
if [ -z "$COMMIT_MSG" ]; then
    CHANGED_FILES=$(git diff --cached --name-only | wc -l)
    COMMIT_MSG="Update $CHANGED_FILES files"
fi

# Create commit
git commit -m "$COMMIT_MSG

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push the branch to remote
git push -u origin "$BRANCH_NAME"

# Prompt for PR title and description
echo ""
echo "📋 Enter PR title (or press Enter to use branch name):"
read -p "PR Title: " PR_TITLE

if [ -z "$PR_TITLE" ]; then
    PR_TITLE="$BRANCH_NAME"
fi

echo ""
echo "📝 Enter PR description (optional):"
read -p "Description: " PR_DESC

if [ -z "$PR_DESC" ]; then
    PR_DESC="Automated pull request for $BRANCH_NAME"
fi

# Create pull request using GitHub CLI
gh pr create --title "$PR_TITLE" --body "$(cat <<EOF
## Summary
$PR_DESC

## Files Changed
$(git diff HEAD~1 --name-only | sed 's/^/- /')

## Test Plan
- [ ] Review all changes
- [ ] Run tests locally
- [ ] Verify functionality

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"

echo "✅ Pull request created successfully!"
echo "Branch: $BRANCH_NAME"
echo "Title: $PR_TITLE"
```