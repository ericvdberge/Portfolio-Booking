Automatically checks git status, creates a feature branch, commits changes, and creates a pull request. Robust and rerunnable - handles existing branches and missing tools gracefully.

```bash
# Function to handle errors gracefully
handle_error() {
    echo "❌ $1"
    echo "💡 You can run this command again to retry from where it left off."
    exit 1
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    handle_error "Not in a git repository"
fi

# Get current git status
echo "📋 Current git status:"
git status --short
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Check if we're already on a feature branch
if [[ "$CURRENT_BRANCH" =~ ^(feature/|bugfix/|hotfix/) ]]; then
    echo "✅ Already on a feature branch: $CURRENT_BRANCH"
    BRANCH_NAME="$CURRENT_BRANCH"
    SKIP_BRANCH_CREATION=true
else
    echo ""
    echo "🌿 Enter a logical branch name (e.g., add-booking-endpoints, fix-auth-bug):"
    read -p "Branch name: " BRANCH_NAME

    # Validate branch name
    if [ -z "$BRANCH_NAME" ]; then
        handle_error "Branch name cannot be empty"
    fi

    # Add feature/ prefix if not already present
    if [[ ! "$BRANCH_NAME" =~ ^(feature/|bugfix/|hotfix/) ]]; then
        BRANCH_NAME="feature/$BRANCH_NAME"
    fi

    # Check if branch already exists
    if git show-ref --verify --quiet refs/heads/"$BRANCH_NAME"; then
        echo "⚠️ Branch '$BRANCH_NAME' already exists."
        echo "1) Switch to existing branch"
        echo "2) Enter a different name"
        read -p "Choose (1 or 2): " CHOICE
        
        case $CHOICE in
            1)
                echo "Switching to existing branch: $BRANCH_NAME"
                git checkout "$BRANCH_NAME" || handle_error "Failed to switch to branch $BRANCH_NAME"
                SKIP_BRANCH_CREATION=true
                ;;
            2)
                echo "Please run the command again with a different branch name."
                exit 0
                ;;
            *)
                handle_error "Invalid choice. Please run the command again."
                ;;
        esac
    else
        echo "Creating branch: $BRANCH_NAME"
        git checkout -b "$BRANCH_NAME" || handle_error "Failed to create branch $BRANCH_NAME"
    fi
fi

# Check if there are any changes (staged or unstaged)
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📝 Adding changes to staging..."
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
    echo "Creating commit..."
    git commit -m "$COMMIT_MSG

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>" || handle_error "Failed to create commit"
else
    echo "✅ No uncommitted changes found"
fi

# Push the branch to remote
echo "Pushing to remote..."
if git push -u origin "$BRANCH_NAME" 2>/dev/null; then
    echo "✅ Successfully pushed to remote"
elif git push origin "$BRANCH_NAME" 2>/dev/null; then
    echo "✅ Successfully pushed to remote (already tracking)"
else
    handle_error "Failed to push to remote. Check your network connection and permissions."
fi

# Create pull request
echo ""
echo "🚀 Creating pull request..."

if command -v gh &> /dev/null; then
    # Check if PR already exists
    if gh pr view &> /dev/null; then
        PR_URL=$(gh pr view --json url -q '.url')
        echo "✅ Pull request already exists: $PR_URL"
    else
        # Prompt for PR title and description
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

        # Create pull request
        if gh pr create --title "$PR_TITLE" --body "## Summary
$PR_DESC

## Files Changed
$(git diff HEAD~1 --name-only 2>/dev/null | sed 's/^/- /' || echo '- Files modified in this branch')

## Test Plan
- [ ] Review all changes
- [ ] Run tests locally
- [ ] Verify functionality

🤖 Generated with [Claude Code](https://claude.ai/code)"; then
            echo "✅ Pull request created successfully!"
            echo "Branch: $BRANCH_NAME"
            echo "Title: $PR_TITLE"
        else
            echo "❌ Failed to create pull request with gh CLI"
            echo "💡 Create manually at the URL shown above"
        fi
    fi
else
    echo "💡 GitHub CLI (gh) not found. Install it to create pull requests automatically."
    echo "📝 Create pull request manually at:"
    
    # Try to construct GitHub URL
    REPO_URL=$(git remote get-url origin 2>/dev/null | sed 's/.*github\.com[:/]\([^/]*\/[^/]*\)\.git.*/\1/' 2>/dev/null)
    if [ ! -z "$REPO_URL" ]; then
        echo "   https://github.com/$REPO_URL/compare/$BRANCH_NAME"
    else
        echo "   Your repository's GitHub page"
    fi
fi

echo ""
echo "✨ Process complete! Branch: $BRANCH_NAME"
```