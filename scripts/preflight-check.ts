#!/usr/bin/env tsx
/**
 * Pre-flight Check Script
 * Validates that the system is ready for sandbox or live testing
 * Run with: npm run preflight or tsx scripts/preflight-check.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

const results: CheckResult[] = [];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function addResult(result: CheckResult) {
  results.push(result);
  const icon = result.status === 'pass' ? '✓' : result.status === 'warning' ? '⚠' : '✗';
  const color = result.status === 'pass' ? 'green' : result.status === 'warning' ? 'yellow' : 'red';
  log(`${icon} ${result.name}: ${result.message}`, color);
  if (result.details) {
    log(`  ${result.details}`, 'cyan');
  }
}

// Check 1: Environment Files
function checkEnvFiles() {
  log('\n📁 Checking Environment Files...', 'blue');
  
  const frontendEnv = existsSync('.env');
  const backendEnv = existsSync('backend/.env');
  
  if (frontendEnv) {
    addResult({
      name: 'Frontend .env',
      status: 'pass',
      message: 'Frontend environment file exists',
    });
  } else {
    addResult({
      name: 'Frontend .env',
      status: 'fail',
      message: 'Missing .env file in root directory',
      details: 'Create .env file with necessary environment variables',
    });
  }
  
  if (backendEnv) {
    addResult({
      name: 'Backend .env',
      status: 'pass',
      message: 'Backend environment file exists',
    });
  } else {
    addResult({
      name: 'Backend .env',
      status: 'fail',
      message: 'Missing .env file in backend directory',
      details: 'Create backend/.env file with necessary environment variables',
    });
  }
}

// Check 2: Required Environment Variables
function checkRequiredEnvVars() {
  log('\n🔐 Checking Required Environment Variables...', 'blue');
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    'VITE_API_BASE_URL',
  ];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value && value !== 'your_value_here') {
      addResult({
        name: varName,
        status: 'pass',
        message: 'Configured',
      });
    } else {
      addResult({
        name: varName,
        status: 'fail',
        message: 'Not configured or using placeholder',
        details: `Set ${varName} in your .env file`,
      });
    }
  });
}

// Check 3: Sandbox Mode Configuration
function checkSandboxMode() {
  log('\n🧪 Checking Sandbox Mode...', 'blue');
  
  const sandboxMode = process.env.VITE_SANDBOX_MODE === 'true';
  const testingMode = process.env.VITE_TESTING_MODE === 'true';
  const realTrading = process.env.VITE_ENABLE_REAL_TRADING === 'true';
  
  if (sandboxMode || testingMode) {
    addResult({
      name: 'Sandbox Mode',
      status: 'pass',
      message: 'Sandbox/Testing mode is enabled',
      details: 'Safe to test without real transactions',
    });
  } else {
    addResult({
      name: 'Sandbox Mode',
      status: 'warning',
      message: 'Sandbox mode is disabled',
      details: 'Set VITE_SANDBOX_MODE=true for safe testing',
    });
  }
  
  if (realTrading && !sandboxMode) {
    addResult({
      name: 'Real Trading',
      status: 'warning',
      message: 'Real trading is enabled without sandbox mode',
      details: '⚠️ CAUTION: Real transactions will be executed!',
    });
  }
}

// Check 4: Market Data Provider
function checkMarketDataProvider() {
  log('\n📊 Checking Market Data Provider...', 'blue');
  
  const provider = process.env.VITE_MARKET_DATA_PROVIDER || 'none';
  const apiKeys = {
    polygon: process.env.VITE_POLYGON_API_KEY,
    alphaVantage: process.env.VITE_ALPHA_VANTAGE_API_KEY,
    iex: process.env.VITE_IEX_API_KEY,
    finnhub: process.env.VITE_FINNHUB_API_KEY,
  };
  
  if (provider === 'none') {
    addResult({
      name: 'Market Data Provider',
      status: 'warning',
      message: 'No market data provider configured',
      details: 'Set VITE_MARKET_DATA_PROVIDER and corresponding API key',
    });
  } else {
    const apiKey = apiKeys[provider as keyof typeof apiKeys];
    if (apiKey && apiKey !== 'your_api_key_here') {
      addResult({
        name: `Market Data (${provider})`,
        status: 'pass',
        message: 'Provider configured with API key',
      });
    } else {
      addResult({
        name: `Market Data (${provider})`,
        status: 'fail',
        message: `API key not configured for ${provider}`,
        details: `Set VITE_${provider.toUpperCase()}_API_KEY in .env file`,
      });
    }
  }
}

// Check 5: Payment Gateway Configuration
function checkPaymentGateways() {
  log('\n💳 Checking Payment Gateways...', 'blue');
  
  const mpesaKey = process.env.VITE_MPESA_CONSUMER_KEY;
  const paypalId = process.env.VITE_PAYPAL_CLIENT_ID;
  const stripeKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (mpesaKey && mpesaKey !== 'your_mpesa_sandbox_consumer_key') {
    addResult({
      name: 'M-Pesa',
      status: 'pass',
      message: 'M-Pesa credentials configured',
    });
  } else {
    addResult({
      name: 'M-Pesa',
      status: 'warning',
      message: 'M-Pesa not configured (optional)',
      details: 'Configure M-Pesa sandbox credentials if needed',
    });
  }
  
  if (paypalId && paypalId !== 'your_paypal_sandbox_client_id') {
    addResult({
      name: 'PayPal',
      status: 'pass',
      message: 'PayPal credentials configured',
    });
  } else {
    addResult({
      name: 'PayPal',
      status: 'warning',
      message: 'PayPal not configured (optional)',
      details: 'Configure PayPal sandbox credentials if needed',
    });
  }
  
  if (stripeKey && stripeKey.startsWith('pk_test_')) {
    addResult({
      name: 'Stripe',
      status: 'pass',
      message: 'Stripe test mode configured',
    });
  } else {
    addResult({
      name: 'Stripe',
      status: 'warning',
      message: 'Stripe not configured (optional)',
      details: 'Configure Stripe test credentials if needed',
    });
  }
}

// Check 6: Database Connection
function checkDatabaseConfig() {
  log('\n🗄️  Checking Database Configuration...', 'blue');
  
  try {
    const backendEnvPath = join(process.cwd(), 'backend', '.env');
    if (existsSync(backendEnvPath)) {
      const envContent = readFileSync(backendEnvPath, 'utf-8');
      const hasDbName = envContent.includes('DB_NAME=');
      const hasDbUser = envContent.includes('DB_USER=');
      
      if (hasDbName && hasDbUser) {
        addResult({
          name: 'Database Config',
          status: 'pass',
          message: 'Database configuration found',
        });
      } else {
        addResult({
          name: 'Database Config',
          status: 'warning',
          message: 'Incomplete database configuration',
          details: 'Check DB_NAME, DB_USER, DB_PASSWORD in backend/.env',
        });
      }
    }
  } catch (error) {
    addResult({
      name: 'Database Config',
      status: 'warning',
      message: 'Could not verify database configuration',
    });
  }
}

// Check 7: Dependencies
function checkDependencies() {
  log('\n📦 Checking Dependencies...', 'blue');
  
  const packageJson = existsSync('package.json');
  const backendRequirements = existsSync('backend/requirements.txt');
  
  if (packageJson) {
    addResult({
      name: 'Frontend Dependencies',
      status: 'pass',
      message: 'package.json found',
      details: 'Run "npm install" if you haven\'t already',
    });
  }
  
  if (backendRequirements) {
    addResult({
      name: 'Backend Dependencies',
      status: 'pass',
      message: 'requirements.txt found',
      details: 'Run "pip install -r requirements.txt" in backend/',
    });
  }
}

// Check 8: Git Status
async function checkGitStatus() {
  log('\n🔄 Checking Git Status...', 'blue');
  
  try {
    const { execSync } = await import('child_process');
    
    // Check if git is available
    try {
      execSync('git --version', { stdio: 'ignore' });
    } catch {
      addResult({
        name: 'Git Status',
        status: 'warning',
        message: 'Git not available',
        details: 'Unable to verify repository status',
      });
      return;
    }
    
    // Check if we're in a git repository
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    } catch {
      addResult({
        name: 'Git Status',
        status: 'warning',
        message: 'Not a git repository',
        details: 'Unable to verify code is up to date',
      });
      return;
    }
    
    // Fetch latest from remote
    try {
      execSync('git fetch origin', { stdio: 'ignore', timeout: 10000 });
    } catch {
      addResult({
        name: 'Git Fetch',
        status: 'warning',
        message: 'Could not fetch from remote',
        details: 'Unable to verify if code is up to date',
      });
      return;
    }
    
    // Check if branch is behind remote
    const status = execSync('git status -sb', { encoding: 'utf-8' });
    const behind = status.match(/behind (\d+)/);
    const ahead = status.match(/ahead (\d+)/);
    
    if (behind) {
      addResult({
        name: 'Git Status',
        status: 'warning',
        message: `Branch is ${behind[1]} commit(s) behind remote`,
        details: 'Run "git pull" to update your code',
      });
    } else if (ahead) {
      addResult({
        name: 'Git Status',
        status: 'pass',
        message: `Branch is up to date (${ahead[1]} commit(s) ahead)`,
        details: 'Local changes not pushed to remote',
      });
    } else {
      addResult({
        name: 'Git Status',
        status: 'pass',
        message: 'Branch is up to date with remote',
      });
    }
    
    // Check for uncommitted changes
    const hasChanges = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
    if (hasChanges) {
      addResult({
        name: 'Uncommitted Changes',
        status: 'warning',
        message: 'You have uncommitted changes',
        details: 'Consider committing or stashing changes before testing',
      });
    }
    
  } catch (error) {
    addResult({
      name: 'Git Status',
      status: 'warning',
      message: 'Could not verify git status',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Generate Summary Report
function generateSummary() {
  log('\n═══════════════════════════════════════', 'cyan');
  log('📋 PRE-FLIGHT CHECK SUMMARY', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  const passed = results.filter(r => r.status === 'pass').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const total = results.length;
  
  log(`\nTotal Checks: ${total}`, 'blue');
  log(`✓ Passed: ${passed}`, 'green');
  log(`⚠ Warnings: ${warnings}`, 'yellow');
  log(`✗ Failed: ${failed}`, 'red');
  
  const percentage = Math.round((passed / total) * 100);
  log(`\nReadiness: ${percentage}%`, percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red');
  
  if (failed > 0) {
    log('\n❌ SYSTEM NOT READY', 'red');
    log('Fix the failed checks before proceeding with testing', 'red');
  } else if (warnings > 0) {
    log('\n⚠️  SYSTEM PARTIALLY READY', 'yellow');
    log('Address warnings for full functionality', 'yellow');
  } else {
    log('\n✅ SYSTEM READY FOR TESTING', 'green');
    log('All checks passed! You can proceed with sandbox testing', 'green');
  }
  
  log('\n═══════════════════════════════════════\n', 'cyan');
}

// Main execution
async function runPreflightChecks() {
  log('╔════════════════════════════════════════╗', 'cyan');
  log('║   HisaHub Stock Flow - Preflight Check  ║', 'cyan');
  log('╚════════════════════════════════════════╝', 'cyan');
  
  checkEnvFiles();
  checkRequiredEnvVars();
  checkSandboxMode();
  checkMarketDataProvider();
  checkPaymentGateways();
  checkDatabaseConfig();
  checkDependencies();
  await checkGitStatus();
  
  generateSummary();
  
  // Exit with appropriate code
  const hasFailures = results.some(r => r.status === 'fail');
  process.exit(hasFailures ? 1 : 0);
}

// Run the checks
runPreflightChecks().catch(error => {
  log(`\n❌ Error running preflight checks: ${error.message}`, 'red');
  process.exit(1);
});
