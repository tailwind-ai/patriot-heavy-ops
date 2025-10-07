/**
 * Detect CI/CD configuration from repository files
 * @param {string} repoPath - Path to repository root
 * @returns {Object} CI/CD detection results
 */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');

/**
 * @typedef {Object} CICDResult
 * @property {string} platform - CI/CD platform (github-actions, circle-ci, travis-ci, gitlab-ci, none)
 * @property {number} confidence - Confidence level (0-1)
 * @property {Array<string>} files - Config files found
 * @property {Object} details - Additional CI/CD details
 */

/**
 * Detect GitHub Actions
 * @param {string} repoPath
 * @returns {CICDResult|null}
 */
function detectGitHubActions(repoPath) {
  const workflowsPath = path.join(repoPath, '.github', 'workflows');
  
  if (!fs.existsSync(workflowsPath)) return null;
  
  const workflows = fs.readdirSync(workflowsPath)
    .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  
  if (workflows.length === 0) return null;
  
  // Parse workflows for details
  const workflowDetails = [];
  const jobs = new Set();
  const triggers = new Set();
  
  for (const workflow of workflows) {
    try {
      const content = fs.readFileSync(path.join(workflowsPath, workflow), 'utf8');
      const parsed = yaml.parse(content);
      
      if (parsed) {
        // Extract triggers
        if (parsed.on) {
          const onEvents = Array.isArray(parsed.on) ? parsed.on : Object.keys(parsed.on);
          onEvents.forEach(event => triggers.add(event));
        }
        
        // Extract jobs
        if (parsed.jobs) {
          Object.keys(parsed.jobs).forEach(job => jobs.add(job));
        }
        
        workflowDetails.push({
          name: workflow,
          jobs: parsed.jobs ? Object.keys(parsed.jobs) : [],
          triggers: parsed.on ? (Array.isArray(parsed.on) ? parsed.on : Object.keys(parsed.on)) : []
        });
      }
    } catch (error) {
      // Skip invalid YAML files
      console.warn(`Failed to parse ${workflow}:`, error.message);
    }
  }
  
  return {
    platform: 'github-actions',
    confidence: 0.95,
    files: workflows.map(w => `.github/workflows/${w}`),
    details: {
      platform: 'GitHub Actions',
      workflows: workflows.length,
      workflowDetails,
      totalJobs: jobs.size,
      triggers: Array.from(triggers),
      hasTests: Array.from(jobs).some(j => j.includes('test')),
      hasLint: Array.from(jobs).some(j => j.includes('lint')),
      hasDeploy: Array.from(jobs).some(j => j.includes('deploy'))
    }
  };
}

/**
 * Detect CircleCI
 * @param {string} repoPath
 * @returns {CICDResult|null}
 */
function detectCircleCI(repoPath) {
  const configPath = path.join(repoPath, '.circleci', 'config.yml');
  
  if (!fs.existsSync(configPath)) return null;
  
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const parsed = yaml.parse(content);
    
    const jobs = parsed.jobs ? Object.keys(parsed.jobs) : [];
    const workflows = parsed.workflows ? Object.keys(parsed.workflows) : [];
    
    return {
      platform: 'circle-ci',
      confidence: 0.95,
      files: ['.circleci/config.yml'],
      details: {
        platform: 'CircleCI',
        version: parsed.version || 'unknown',
        jobs: jobs.length,
        workflows: workflows.length,
        hasTests: jobs.some(j => j.includes('test')),
        hasLint: jobs.some(j => j.includes('lint')),
        hasDeploy: jobs.some(j => j.includes('deploy'))
      }
    };
  } catch (error) {
    return {
      platform: 'circle-ci',
      confidence: 0.7,
      files: ['.circleci/config.yml'],
      details: {
        platform: 'CircleCI',
        error: 'Failed to parse config'
      }
    };
  }
}

/**
 * Detect Travis CI
 * @param {string} repoPath
 * @returns {CICDResult|null}
 */
function detectTravisCI(repoPath) {
  const configPath = path.join(repoPath, '.travis.yml');
  
  if (!fs.existsSync(configPath)) return null;
  
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const parsed = yaml.parse(content);
    
    return {
      platform: 'travis-ci',
      confidence: 0.95,
      files: ['.travis.yml'],
      details: {
        platform: 'Travis CI',
        language: parsed.language || 'unknown',
        hasTests: parsed.script !== undefined,
        hasDeploy: parsed.deploy !== undefined
      }
    };
  } catch (error) {
    return {
      platform: 'travis-ci',
      confidence: 0.7,
      files: ['.travis.yml'],
      details: {
        platform: 'Travis CI',
        error: 'Failed to parse config'
      }
    };
  }
}

/**
 * Detect GitLab CI
 * @param {string} repoPath
 * @returns {CICDResult|null}
 */
function detectGitLabCI(repoPath) {
  const configPath = path.join(repoPath, '.gitlab-ci.yml');
  
  if (!fs.existsSync(configPath)) return null;
  
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const parsed = yaml.parse(content);
    
    // Extract stages and jobs
    const stages = parsed.stages || [];
    const jobs = Object.keys(parsed).filter(key => 
      !['stages', 'variables', 'before_script', 'after_script', 'image'].includes(key)
    );
    
    return {
      platform: 'gitlab-ci',
      confidence: 0.95,
      files: ['.gitlab-ci.yml'],
      details: {
        platform: 'GitLab CI',
        stages: stages.length,
        jobs: jobs.length,
        hasTests: stages.includes('test') || jobs.some(j => j.includes('test')),
        hasDeploy: stages.includes('deploy') || jobs.some(j => j.includes('deploy'))
      }
    };
  } catch (error) {
    return {
      platform: 'gitlab-ci',
      confidence: 0.7,
      files: ['.gitlab-ci.yml'],
      details: {
        platform: 'GitLab CI',
        error: 'Failed to parse config'
      }
    };
  }
}

/**
 * Detect test frameworks
 * @param {string} repoPath
 * @returns {Object}
 */
function detectTestFrameworks(repoPath) {
  const frameworks = [];
  
  const packageJsonPath = path.join(repoPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = fs.readJsonSync(packageJsonPath);
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    if (allDeps.jest) frameworks.push('Jest');
    if (allDeps.mocha) frameworks.push('Mocha');
    if (allDeps.vitest) frameworks.push('Vitest');
    if (allDeps['@playwright/test']) frameworks.push('Playwright');
    if (allDeps.cypress) frameworks.push('Cypress');
    if (allDeps.pytest) frameworks.push('pytest');
  }
  
  return frameworks;
}

/**
 * Detect linting tools
 * @param {string} repoPath
 * @returns {Object}
 */
function detectLinters(repoPath) {
  const linters = [];
  
  if (fs.existsSync(path.join(repoPath, '.eslintrc.js')) ||
      fs.existsSync(path.join(repoPath, '.eslintrc.json')) ||
      fs.existsSync(path.join(repoPath, 'eslint.config.js'))) {
    linters.push('ESLint');
  }
  
  if (fs.existsSync(path.join(repoPath, '.prettierrc')) ||
      fs.existsSync(path.join(repoPath, '.prettierrc.json')) ||
      fs.existsSync(path.join(repoPath, 'prettier.config.js'))) {
    linters.push('Prettier');
  }
  
  return linters;
}

/**
 * Detect CI/CD configuration
 * @param {string} repoPath - Path to repository root
 * @returns {CICDResult}
 */
function detectCICD(repoPath) {
  if (!fs.existsSync(repoPath)) {
    throw new Error(`Repository path does not exist: ${repoPath}`);
  }
  
  // Try each detection method
  const detectors = [
    detectGitHubActions,
    detectCircleCI,
    detectTravisCI,
    detectGitLabCI
  ];
  
  const results = detectors
    .map(detector => detector(repoPath))
    .filter(result => result !== null)
    .sort((a, b) => b.confidence - a.confidence);
  
  // Detect additional tools
  const testFrameworks = detectTestFrameworks(repoPath);
  const linters = detectLinters(repoPath);
  
  // Return highest confidence result
  if (results.length > 0) {
    const result = results[0];
    result.details.testFrameworks = testFrameworks;
    result.details.linters = linters;
    return result;
  }
  
  // No CI/CD detected
  return {
    platform: 'none',
    confidence: 0.8,
    files: [],
    details: {
      platform: 'None',
      message: 'No CI/CD configuration detected',
      testFrameworks,
      linters
    }
  };
}

module.exports = {
  detectCICD,
  detectGitHubActions,
  detectCircleCI,
  detectTravisCI,
  detectGitLabCI,
  detectTestFrameworks,
  detectLinters
};
