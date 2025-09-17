import { getCurrentVersion, incrementVersion, createBranchName, createPRTitle } from '../scripts/version';

// Mock fs module
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();

jest.mock('fs', () => ({
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
}));

describe('Version Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentVersion', () => {
    it('should read version from package.json', () => {
      const mockPackageJson = { version: '1.2.3' };
      mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

      const version = getCurrentVersion();
      
      expect(version).toBe('1.2.3');
      expect(mockReadFileSync).toHaveBeenCalledWith(
        expect.stringContaining('package.json'),
        'utf8'
      );
    });
  });

  describe('incrementVersion', () => {
    it('should increment patch version', () => {
      const result = incrementVersion('1.2.3', 'patch');
      expect(result).toBe('1.2.4');
    });

    it('should increment minor version', () => {
      const result = incrementVersion('1.2.3', 'minor');
      expect(result).toBe('1.3.0');
    });

    it('should increment major version', () => {
      const result = incrementVersion('1.2.3', 'major');
      expect(result).toBe('2.0.0');
    });

    it('should increment patch by PR number', () => {
      const result = incrementVersion('1.2.3', '5');
      expect(result).toBe('1.2.8');
    });

    it('should throw error for invalid version type', () => {
      expect(() => {
        incrementVersion('1.2.3', 'invalid');
      }).toThrow('Invalid version type: invalid');
    });
  });

  describe('createBranchName', () => {
    it('should create proper feature branch name', () => {
      const branchName = createBranchName('1.2.3', 'New Awesome Feature');
      expect(branchName).toBe('feature/v1.2.3-new-awesome-feature');
    });

    it('should handle special characters in feature name', () => {
      const branchName = createBranchName('1.2.3', 'Feature with @#$%^&*() chars!');
      expect(branchName).toBe('feature/v1.2.3-feature-with-chars');
    });

    it('should truncate long feature names', () => {
      const longName = 'a'.repeat(100);
      const branchName = createBranchName('1.2.3', longName);
      expect(branchName.length).toBeLessThanOrEqual(60); // feature/v1.2.3- + 50 chars
    });
  });

  describe('createPRTitle', () => {
    it('should create proper PR title', () => {
      const title = createPRTitle('1.2.3', 'Add new feature');
      expect(title).toBe('Release v1.2.3: Add new feature');
    });

    it('should handle empty feature name', () => {
      const title = createPRTitle('1.2.3', '');
      expect(title).toBe('Release v1.2.3: ');
    });
  });
});

describe('CI/CD Pipeline Integration', () => {
  it('should demonstrate automated testing workflow', () => {
    // This test simulates the CI/CD pipeline behavior
    const testData = {
      currentVersion: '1.0.0',
      prNumber: 42,
      featureName: 'automated-testing',
      expectedNewVersion: '1.0.42',
      expectedBranchName: 'feature/v1.0.42-automated-testing',
      expectedPRTitle: 'Release v1.0.42: automated-testing'
    };

    // Simulate version increment based on PR number
    const newVersion = incrementVersion(testData.currentVersion, testData.prNumber.toString());
    expect(newVersion).toBe(testData.expectedNewVersion);

    // Simulate branch name creation
    const branchName = createBranchName(newVersion, testData.featureName);
    expect(branchName).toBe(testData.expectedBranchName);

    // Simulate PR title creation
    const prTitle = createPRTitle(newVersion, testData.featureName);
    expect(prTitle).toBe(testData.expectedPRTitle);

    // Verify the complete workflow
    expect({
      version: newVersion,
      branch: branchName,
      prTitle: prTitle
    }).toEqual({
      version: '1.0.42',
      branch: 'feature/v1.0.42-automated-testing',
      prTitle: 'Release v1.0.42: automated-testing'
    });
  });

  it('should validate semantic versioning format', () => {
    const versions = ['1.0.0', '1.2.3', '10.20.30'];
    
    versions.forEach(version => {
      const parts = version.split('.');
      expect(parts).toHaveLength(3);
      expect(parts.every(part => /^\d+$/.test(part))).toBe(true);
    });
  });
});
