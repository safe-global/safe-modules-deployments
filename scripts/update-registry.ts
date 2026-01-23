#!/usr/bin/env node
/**
 * Update Modules Registry Script
 *
 * This script updates the networkAddresses in module deployment JSON files.
 * It can be run from the command line or called from GitHub Actions.
 *
 * Usage:
 *   pnpm update-registry --chain-id <chainId> --module <type> --version <version> --address <address>
 *
 * Example:
 *   pnpm update-registry --chain-id 11155111 --module allowance --version 0.1.1 --address 0xAA46724893dedD72658219405185Fb0Fc91e091C
 */

import * as fs from 'fs';
import * as path from 'path';
import { getAddress } from 'viem';

// Supported modules configuration
const MODULE_CONFIG: Record<
  string,
  {
    dir: string;
    contractName: string;
    jsonFile: string;
    supportedVersions: string[];
  }
> = {
  allowance: {
    dir: 'allowance-module',
    contractName: 'AllowanceModule',
    jsonFile: 'allowance-module.json',
    supportedVersions: ['0.1.1'],
  },
  'social-recovery': {
    dir: 'safe-recovery-module',
    contractName: 'SocialRecoveryModule',
    jsonFile: 'social-recovery-module.json',
    supportedVersions: ['0.1.0'],
  },
};

interface ModuleDeployment {
  released: boolean;
  contractName: string;
  version: string;
  networkAddresses: Record<string, string>;
  abi: unknown[];
}

interface UpdateResult {
  success: boolean;
  action: 'added' | 'updated' | 'unchanged';
  message: string;
  assetPath?: string;
}

function parseArgs(): {
  chainId: string;
  moduleType: string;
  version: string;
  address: string;
} {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[++i];
      if (value && !value.startsWith('--')) {
        result[key] = value;
      }
    }
  }

  // Support both kebab-case and camelCase
  const chainId = result['chain-id'] || result['chainId'];
  const moduleType = result['module'] || result['module-type'] || result['moduleType'];
  const version = result['version'];
  const address = result['address'] || result['contract-address'];

  if (!chainId || !moduleType || !version || !address) {
    console.error(
      'Usage: pnpm update-registry --chain-id <chainId> --module <type> --version <version> --address <address>',
    );
    console.error('');
    console.error('Required arguments:');
    console.error('  --chain-id      Chain ID (e.g., 11155111)');
    console.error('  --module        Module type: allowance, social-recovery');
    console.error('  --version       Module version (e.g., 0.1.1)');
    console.error('  --address       Deployed contract address (0x...)');
    process.exit(1);
  }

  return { chainId, moduleType, version, address };
}

function validateInputs(chainId: string, moduleType: string, version: string, address: string): void {
  // Validate chain ID is a number
  if (!/^\d+$/.test(chainId)) {
    throw new Error(`Invalid chain_id: "${chainId}" must be a number`);
  }

  // Validate contract address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error(
      `Invalid contract_address: "${address}" must be a valid Ethereum address (0x followed by 40 hex characters)`,
    );
  }

  // Prevent path traversal in version parameter (check before using in path construction)
  if (version.includes('..') || version.includes('/') || version.includes('\\')) {
    throw new Error(`Invalid version: "${version}" contains illegal path characters`);
  }

  // Validate module type
  const config = MODULE_CONFIG[moduleType];
  if (!config) {
    const validModules = Object.keys(MODULE_CONFIG).join(', ');
    throw new Error(`Unknown module_type: "${moduleType}". Valid options: ${validModules}`);
  }

  // Validate version against whitelist (implicitly validates format as well)
  if (!config.supportedVersions.includes(version)) {
    throw new Error(
      `Invalid version "${version}" for module "${moduleType}". Supported versions: ${config.supportedVersions.join(', ')}`,
    );
  }
}

function getAssetPath(moduleType: string, version: string): string {
  const config = MODULE_CONFIG[moduleType];
  if (!config) {
    throw new Error(`Unknown module type: ${moduleType}`);
  }

  const assetPath = path.join(__dirname, '..', 'src', 'assets', config.dir, `v${version}`, config.jsonFile);

  return assetPath;
}

function updateRegistry(chainId: string, moduleType: string, version: string, address: string): UpdateResult {
  // Validate inputs
  validateInputs(chainId, moduleType, version, address);

  const config = MODULE_CONFIG[moduleType];
  const assetPath = getAssetPath(moduleType, version);

  // Check if asset file exists
  if (!fs.existsSync(assetPath)) {
    throw new Error(
      `Asset file not found: ${assetPath}. Please ensure version ${version} exists for module ${moduleType}`,
    );
  }

  // Read current JSON
  const content = fs.readFileSync(assetPath, 'utf-8');
  const data: ModuleDeployment = JSON.parse(content);

  // Normalize address to EIP-55 checksum format
  const normalizedAddress = getAddress(address);

  // Check if already exists with same address
  if (data.networkAddresses[chainId] === normalizedAddress) {
    return {
      success: true,
      action: 'unchanged',
      message: `Chain ID ${chainId} already has the same address. No update needed.`,
      assetPath,
    };
  }

  const isNew = !data.networkAddresses[chainId];

  // Update the address
  data.networkAddresses[chainId] = normalizedAddress;

  // Sort network addresses by chain ID (numeric sort) for consistency
  const sortedAddresses: Record<string, string> = {};
  Object.keys(data.networkAddresses)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((key) => {
      sortedAddresses[key] = data.networkAddresses[key];
    });
  data.networkAddresses = sortedAddresses;

  // Write back to file
  fs.writeFileSync(assetPath, JSON.stringify(data, null, 2) + '\n');

  const action = isNew ? 'added' : 'updated';

  return {
    success: true,
    action,
    message: `${action === 'added' ? 'Added' : 'Updated'} chain ID ${chainId} with address ${normalizedAddress} for ${config.contractName}`,
    assetPath,
  };
}

// Main execution
function main(): void {
  try {
    const { chainId, moduleType, version, address } = parseArgs();

    console.log('🔄 Updating module registry...');
    console.log(`   Chain ID: ${chainId}`);
    console.log(`   Module: ${moduleType}`);
    console.log(`   Version: ${version}`);
    console.log(`   Address: ${address}`);
    console.log('');

    const result = updateRegistry(chainId, moduleType, version, address);

    if (result.success) {
      const icon = result.action === 'unchanged' ? 'ℹ️' : '✅';
      console.log(`${icon} ${result.message}`);
      console.log(`   Asset: ${result.assetPath}`);

      // Output for GitHub Actions
      if (process.env.GITHUB_OUTPUT) {
        const output = [
          `action=${result.action}`,
          `has_changes=${result.action !== 'unchanged'}`,
          `asset_path=${result.assetPath}`,
          `message=${result.message}`,
        ].join('\n');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, output + '\n');
      }

      // Output for GitHub Actions step summary
      if (process.env.GITHUB_STEP_SUMMARY) {
        const summary = [
          '## 📦 Module Registry Update',
          '',
          '| Property | Value |',
          '|----------|-------|',
          `| **Chain ID** | ${chainId} |`,
          `| **Module** | ${moduleType} |`,
          `| **Version** | ${version} |`,
          `| **Address** | \`${address}\` |`,
          `| **Action** | ${result.action} |`,
          '',
        ].join('\n');
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error: ${message}`);

    // Output error for GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::error::${message}`);
    }

    process.exit(1);
  }
}

main();
