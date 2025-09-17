#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Version management script for automated semantic versioning
 * Usage: node scripts/version.js [patch|minor|major|pr-number]
 */

function getCurrentVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  return packageJson.version;
}

function updateVersion(newVersion) {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
}

function incrementVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      // If it's a number (PR number), increment patch by that amount
      const prNumber = parseInt(type);
      if (!isNaN(prNumber)) {
        return `${major}.${minor}.${patch + prNumber}`;
      }
      throw new Error(`Invalid version type: ${type}`);
  }
}

function createBranchName(version, featureName) {
  const cleanFeatureName = featureName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  return `feature/v${version}-${cleanFeatureName}`;
}

function createPRTitle(version, featureName) {
  return `Release v${version}: ${featureName}`;
}

function main() {
  const args = process.argv.slice(2);
  const versionType = args[0] || 'patch';
  const featureName = args[1] || 'new-feature';
  
  try {
    const currentVersion = getCurrentVersion();
    console.log(`Current version: ${currentVersion}`);
    
    const newVersion = incrementVersion(currentVersion, versionType);
    console.log(`New version: ${newVersion}`);
    
    // Update package.json
    updateVersion(newVersion);
    console.log(`✅ Updated package.json to version ${newVersion}`);
    
    // Create branch name
    const branchName = createBranchName(newVersion, featureName);
    console.log(`📝 Suggested branch name: ${branchName}`);
    
    // Create PR title
    const prTitle = createPRTitle(newVersion, featureName);
    console.log(`📝 Suggested PR title: ${prTitle}`);
    
    // Git commands
    console.log('\n🚀 Git commands to run:');
    console.log(`git checkout -b ${branchName}`);
    console.log(`git add package.json`);
    console.log(`git commit -m "chore: bump version to ${newVersion}"`);
    console.log(`git push -u origin ${branchName}`);
    console.log(`\nThen create a PR with title: "${prTitle}"`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getCurrentVersion,
  updateVersion,
  incrementVersion,
  createBranchName,
  createPRTitle
};
