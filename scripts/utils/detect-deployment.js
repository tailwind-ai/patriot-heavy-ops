/**
 * Detect deployment method from repository files
 * @param {string} repoPath - Path to repository root
 * @returns {Object} Deployment detection results
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * @typedef {Object} DeploymentResult
 * @property {string} method - Deployment method (vercel, docker, clasp, github-actions, manual, unknown)
 * @property {number} confidence - Confidence level (0-1)
 * @property {Array<string>} evidence - Files/patterns that led to detection
 * @property {Object} details - Additional deployment details
 */

/**
 * Detect Vercel deployment
 * @param {string} repoPath
 * @returns {DeploymentResult|null}
 */
function detectVercel(repoPath) {
  const evidence = [];
  
  // Check for vercel.json
  if (fs.existsSync(path.join(repoPath, 'vercel.json'))) {
    evidence.push('vercel.json');
  }
  
  // Check for .vercel directory
  if (fs.existsSync(path.join(repoPath, '.vercel'))) {
    evidence.push('.vercel/');
  }
  
  // Check package.json for vercel scripts
  const packageJsonPath = path.join(repoPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = fs.readJsonSync(packageJsonPath);
    if (packageJson.scripts) {
      if (packageJson.scripts.deploy?.includes('vercel')) {
        evidence.push('package.json: vercel deploy script');
      }
    }
  }
  
  if (evidence.length === 0) return null;
  
  return {
    method: 'vercel',
    confidence: evidence.length >= 2 ? 0.95 : 0.7,
    evidence,
    details: {
      platform: 'Vercel',
      type: 'serverless'
    }
  };
}

/**
 * Detect Docker deployment
 * @param {string} repoPath
 * @returns {DeploymentResult|null}
 */
function detectDocker(repoPath) {
  const evidence = [];
  
  // Check for Dockerfile
  if (fs.existsSync(path.join(repoPath, 'Dockerfile'))) {
    evidence.push('Dockerfile');
  }
  
  // Check for docker-compose.yml
  if (fs.existsSync(path.join(repoPath, 'docker-compose.yml')) ||
      fs.existsSync(path.join(repoPath, 'docker-compose.yaml'))) {
    evidence.push('docker-compose.yml');
  }
  
  // Check for .dockerignore
  if (fs.existsSync(path.join(repoPath, '.dockerignore'))) {
    evidence.push('.dockerignore');
  }
  
  if (evidence.length === 0) return null;
  
  return {
    method: 'docker',
    confidence: evidence.includes('Dockerfile') ? 0.9 : 0.6,
    evidence,
    details: {
      platform: 'Docker',
      type: 'containerized',
      hasCompose: evidence.includes('docker-compose.yml')
    }
  };
}

/**
 * Detect Google Apps Script (clasp) deployment
 * @param {string} repoPath
 * @returns {DeploymentResult|null}
 */
function detectClasp(repoPath) {
  const evidence = [];
  
  // Check for .clasp.json
  if (fs.existsSync(path.join(repoPath, '.clasp.json'))) {
    evidence.push('.clasp.json');
  }
  
  // Check for appsscript.json
  if (fs.existsSync(path.join(repoPath, 'appsscript.json'))) {
    evidence.push('appsscript.json');
  }
  
  // Check package.json for clasp
  const packageJsonPath = path.join(repoPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = fs.readJsonSync(packageJsonPath);
    if (packageJson.devDependencies?.['@google/clasp'] || 
        packageJson.dependencies?.['@google/clasp']) {
      evidence.push('package.json: @google/clasp dependency');
    }
    if (packageJson.scripts) {
      if (packageJson.scripts.push?.includes('clasp') || 
          packageJson.scripts.deploy?.includes('clasp')) {
        evidence.push('package.json: clasp deploy script');
      }
    }
  }
  
  if (evidence.length === 0) return null;
  
  return {
    method: 'clasp',
    confidence: evidence.includes('.clasp.json') ? 0.95 : 0.7,
    evidence,
    details: {
      platform: 'Google Apps Script',
      type: 'serverless',
      tool: 'clasp'
    }
  };
}

/**
 * Detect GitHub Actions deployment
 * @param {string} repoPath
 * @returns {DeploymentResult|null}
 */
function detectGitHubActions(repoPath) {
  const evidence = [];
  const workflowsPath = path.join(repoPath, '.github', 'workflows');
  
  if (!fs.existsSync(workflowsPath)) return null;
  
  const workflows = fs.readdirSync(workflowsPath)
    .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  
  for (const workflow of workflows) {
    const content = fs.readFileSync(path.join(workflowsPath, workflow), 'utf8');
    
    // Check for deployment keywords
    if (content.includes('deploy') || 
        content.includes('deployment') ||
        content.includes('vercel') ||
        content.includes('docker push') ||
        content.includes('aws') ||
        content.includes('azure')) {
      evidence.push(`.github/workflows/${workflow}`);
    }
  }
  
  if (evidence.length === 0) return null;
  
  return {
    method: 'github-actions',
    confidence: 0.85,
    evidence,
    details: {
      platform: 'GitHub Actions',
      type: 'ci-cd',
      workflows: workflows.length
    }
  };
}

/**
 * Detect deployment method
 * @param {string} repoPath - Path to repository root
 * @returns {DeploymentResult}
 */
function detectDeployment(repoPath) {
  if (!fs.existsSync(repoPath)) {
    throw new Error(`Repository path does not exist: ${repoPath}`);
  }
  
  // Try each detection method
  const detectors = [
    detectVercel,
    detectDocker,
    detectClasp,
    detectGitHubActions
  ];
  
  const results = detectors
    .map(detector => detector(repoPath))
    .filter(result => result !== null)
    .sort((a, b) => b.confidence - a.confidence);
  
  // Return highest confidence result
  if (results.length > 0) {
    return results[0];
  }
  
  // No deployment method detected
  return {
    method: 'manual',
    confidence: 0.5,
    evidence: ['No automated deployment detected'],
    details: {
      platform: 'Unknown',
      type: 'manual'
    }
  };
}

module.exports = {
  detectDeployment,
  detectVercel,
  detectDocker,
  detectClasp,
  detectGitHubActions
};
