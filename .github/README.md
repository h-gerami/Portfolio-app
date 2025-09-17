# 🚀 Automated CI/CD Pipeline

This repository includes a complete automated CI/CD pipeline that handles versioning, testing, and deployment.

## 🔄 Workflow Overview

### 1. **Pull Request Creation**
- Create a feature branch: `feature/v1.1.0-new-feature`
- Use the PR template for consistent formatting
- PR title format: `Release v1.1.0: New Feature Description`

### 2. **Automated Testing**
- Runs on every PR creation/update
- Executes Jest tests with coverage
- Runs ESLint for code quality
- Uploads coverage reports to Codecov

### 3. **Auto-Merge**
- Automatically merges PR to main when tests pass
- Uses squash merge for clean history
- Creates descriptive commit messages

### 4. **Version Management**
- Automatically creates version tags based on PR number
- Updates package.json version
- Creates GitHub releases with changelog

## 🛠️ Available Scripts

```bash
# Version management
npm run version:patch    # Increment patch version (1.0.0 → 1.0.1)
npm run version:minor    # Increment minor version (1.0.0 → 1.1.0)
npm run version:major    # Increment major version (1.0.0 → 2.0.0)
npm run version:pr       # Interactive version bump with PR number

# Testing
npm run test:ci          # Run tests in CI mode (no watch, with coverage)
npm run release          # Full release process (test + lint + version bump)
```

## 📋 Branch Naming Convention

- **Feature branches**: `feature/v1.1.0-description`
- **Bug fixes**: `bugfix/v1.1.1-description`
- **Hotfixes**: `hotfix/v1.1.2-description`
- **Chores**: `chore/v1.1.3-description`

## 🏷️ Version Tagging Strategy

- **Patch versions** (1.0.0 → 1.0.1): Bug fixes, small improvements
- **Minor versions** (1.0.0 → 1.1.0): New features, enhancements
- **Major versions** (1.0.0 → 2.0.0): Breaking changes, major rewrites

## 🔧 GitHub Settings Required

### Branch Protection Rules
1. Go to **Settings > Branches**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Include administrators

### Auto-Merge Settings
1. Go to **Settings > General**
2. Enable **"Allow auto-merge"**
3. Enable **"Automatically delete head branches"**

### Workflow Permissions
1. Go to **Settings > Actions > General**
2. Set **"Workflow permissions"** to **"Read and write permissions"**
3. Check **"Allow GitHub Actions to create and approve pull requests"**

## 🚀 Quick Start Guide

### Creating a New Feature Release

1. **Create a new branch:**
   ```bash
   npm run version:patch "my-new-feature"
   # Follow the suggested git commands
   ```

2. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push
   ```

3. **Create a Pull Request:**
   - Use the PR template
   - Title format: `Release v1.1.0: My New Feature`
   - The CI will automatically test and merge if successful

### Manual Release Process

```bash
# Run full release process
npm run release

# Or step by step
npm run test:ci
npm run lint
npm run version:patch "release-description"
```

## 📊 CI/CD Pipeline Details

### Workflow Triggers
- **Pull Request**: `opened`, `synchronize`, `reopened`
- **Push to main**: For direct commits (if needed)

### Jobs
1. **Test Job**: Runs tests, linting, and coverage
2. **Auto-Merge Job**: Merges PR when tests pass
3. **Version & Tag Job**: Creates version tags and GitHub releases

### Status Checks
- ✅ Jest tests pass
- ✅ ESLint passes
- ✅ Coverage threshold met
- ✅ All dependencies installed successfully

## 🔍 Monitoring

- **Test Results**: Check the Actions tab for detailed test results
- **Coverage**: View coverage reports in Codecov
- **Releases**: Check the Releases page for version history
- **Tags**: View all version tags in the Tags section

## 🛡️ Security

- All workflows use `GITHUB_TOKEN` for authentication
- No external secrets required
- Branch protection prevents direct pushes to main
- Auto-merge only occurs after successful test execution

## 📝 Troubleshooting

### Common Issues

1. **Tests failing**: Check the Actions tab for detailed error logs
2. **Auto-merge not working**: Verify branch protection settings
3. **Version conflicts**: Ensure package.json is up to date
4. **Permission errors**: Check workflow permissions in repository settings

### Manual Override

If auto-merge fails, you can manually merge the PR after ensuring tests pass locally:

```bash
npm run test:ci
npm run lint
```

## 🎯 Best Practices

1. **Always use the PR template** for consistent formatting
2. **Write descriptive commit messages** following conventional commits
3. **Keep feature branches focused** on single features
4. **Test locally** before pushing to avoid CI failures
5. **Use semantic versioning** for meaningful releases

---

**Note**: This pipeline is designed to be fully automated. Once set up correctly, you only need to create PRs with proper naming conventions, and everything else happens automatically! 🚀
