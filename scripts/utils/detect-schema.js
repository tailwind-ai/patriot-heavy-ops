/**
 * Detect database schema from repository files
 * @param {string} repoPath - Path to repository root
 * @returns {Object} Schema detection results
 */

const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');

/**
 * @typedef {Object} SchemaResult
 * @property {string} type - Schema type (prisma, sql, typeorm, mongoose, custom, none)
 * @property {number} confidence - Confidence level (0-1)
 * @property {Array<string>} files - Schema files found
 * @property {Object} details - Additional schema details
 */

/**
 * Detect Prisma schema
 * @param {string} repoPath
 * @returns {SchemaResult|null}
 */
async function detectPrisma(repoPath) {
  const files = [];
  
  // Look for schema.prisma
  const schemaPath = path.join(repoPath, 'prisma', 'schema.prisma');
  if (fs.existsSync(schemaPath)) {
    files.push('prisma/schema.prisma');
  }
  
  // Check package.json for prisma
  const packageJsonPath = path.join(repoPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = fs.readJsonSync(packageJsonPath);
    if (packageJson.devDependencies?.prisma || 
        packageJson.dependencies?.['@prisma/client']) {
      files.push('package.json: prisma dependency');
    }
  }
  
  if (files.length === 0) return null;
  
  // Parse schema for details
  let models = [];
  if (fs.existsSync(schemaPath)) {
    const content = fs.readFileSync(schemaPath, 'utf8');
    const modelMatches = content.match(/model\s+(\w+)\s*{/g);
    if (modelMatches) {
      models = modelMatches.map(m => m.match(/model\s+(\w+)/)[1]);
    }
  }
  
  return {
    type: 'prisma',
    confidence: files.includes('prisma/schema.prisma') ? 0.95 : 0.7,
    files,
    details: {
      orm: 'Prisma',
      models: models.length,
      modelNames: models.slice(0, 10) // First 10 models
    }
  };
}

/**
 * Detect SQL schema files
 * @param {string} repoPath
 * @returns {SchemaResult|null}
 */
async function detectSQL(repoPath) {
  const files = [];
  
  // Look for .sql files
  const sqlFiles = await glob('**/*.sql', {
    cwd: repoPath,
    ignore: ['node_modules/**', 'dist/**', 'build/**'],
    nodir: true
  });
  
  if (sqlFiles.length === 0) return null;
  
  // Categorize SQL files
  const migrations = sqlFiles.filter(f => 
    f.includes('migration') || f.includes('migrate') || f.includes('schema')
  );
  
  return {
    type: 'sql',
    confidence: migrations.length > 0 ? 0.85 : 0.6,
    files: sqlFiles.slice(0, 10), // First 10 files
    details: {
      orm: 'SQL',
      totalFiles: sqlFiles.length,
      migrations: migrations.length,
      hasMigrations: migrations.length > 0
    }
  };
}

/**
 * Detect TypeORM schema
 * @param {string} repoPath
 * @returns {SchemaResult|null}
 */
async function detectTypeORM(repoPath) {
  const files = [];
  
  // Check package.json for typeorm
  const packageJsonPath = path.join(repoPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = fs.readJsonSync(packageJsonPath);
    if (packageJson.dependencies?.typeorm || 
        packageJson.devDependencies?.typeorm) {
      files.push('package.json: typeorm dependency');
    }
  }
  
  // Look for entity files
  const entityFiles = await glob('**/*.entity.{ts,js}', {
    cwd: repoPath,
    ignore: ['node_modules/**', 'dist/**', 'build/**'],
    nodir: true
  });
  
  if (files.length === 0 && entityFiles.length === 0) return null;
  
  return {
    type: 'typeorm',
    confidence: files.length > 0 && entityFiles.length > 0 ? 0.9 : 0.6,
    files: [...files, ...entityFiles.slice(0, 5)],
    details: {
      orm: 'TypeORM',
      entities: entityFiles.length
    }
  };
}

/**
 * Detect Mongoose schema
 * @param {string} repoPath
 * @returns {SchemaResult|null}
 */
async function detectMongoose(repoPath) {
  const files = [];
  
  // Check package.json for mongoose
  const packageJsonPath = path.join(repoPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = fs.readJsonSync(packageJsonPath);
    if (packageJson.dependencies?.mongoose) {
      files.push('package.json: mongoose dependency');
    }
  }
  
  // Look for schema/model files
  const schemaFiles = await glob('**/*{schema,model,models}.{ts,js}', {
    cwd: repoPath,
    ignore: ['node_modules/**', 'dist/**', 'build/**'],
    nodir: true
  });
  
  if (files.length === 0 && schemaFiles.length === 0) return null;
  
  return {
    type: 'mongoose',
    confidence: files.length > 0 && schemaFiles.length > 0 ? 0.85 : 0.6,
    files: [...files, ...schemaFiles.slice(0, 5)],
    details: {
      orm: 'Mongoose',
      database: 'MongoDB',
      schemas: schemaFiles.length
    }
  };
}

/**
 * Detect database schema
 * @param {string} repoPath - Path to repository root
 * @returns {Promise<SchemaResult>}
 */
async function detectSchema(repoPath) {
  if (!fs.existsSync(repoPath)) {
    throw new Error(`Repository path does not exist: ${repoPath}`);
  }
  
  // Try each detection method
  const detectors = [
    detectPrisma,
    detectTypeORM,
    detectMongoose,
    detectSQL
  ];
  
  const results = [];
  for (const detector of detectors) {
    const result = await detector(repoPath);
    if (result) results.push(result);
  }
  
  // Sort by confidence
  results.sort((a, b) => b.confidence - a.confidence);
  
  // Return highest confidence result
  if (results.length > 0) {
    return results[0];
  }
  
  // No schema detected
  return {
    type: 'none',
    confidence: 0.8,
    files: [],
    details: {
      orm: 'None',
      message: 'No database schema detected'
    }
  };
}

module.exports = {
  detectSchema,
  detectPrisma,
  detectSQL,
  detectTypeORM,
  detectMongoose
};
