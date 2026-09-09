#!/usr/bin/env tsx
/**
 * Diffs an asset JSON file against its content at a base commit to find which chain
 * ID(s) were added or changed, then verifies each one's bytecode against an
 * already-registered (unchanged) reference chain in the same file.
 *
 * These are deterministic CREATE2 deployments, so the runtime bytecode for a given
 * module+version must be byte-identical on every chain it's deployed on. There is no
 * stored "expected" codeHash in this schema (unlike safe-deployments), so this checks
 * cross-chain consistency instead of comparing against a stored hash.
 *
 * Only chains that actually changed in the diff are checked — not every chain in the
 * file — so unrelated, already-verified chains can't fail an unrelated PR.
 *
 * Usage:
 *   tsx scripts/review/verifyDeployment.ts <path-to-asset.json> --base <git-ref-or-sha>
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { createPublicClient, http, keccak256 } from 'viem';

function parseArgs(): { assetPath: string; base: string } {
  const args = process.argv.slice(2);
  const assetPath = args[0];
  const baseIndex = args.indexOf('--base');
  const base = baseIndex !== -1 ? args[baseIndex + 1] : undefined;

  if (!assetPath || !base) {
    throw new Error('Usage: tsx scripts/review/verifyDeployment.ts <path-to-asset.json> --base <git-ref-or-sha>');
  }
  return { assetPath, base };
}

function readNetworkAddressesAt(ref: string, assetPath: string): Record<string, string> {
  try {
    const content = execFileSync('git', ['show', `${ref}:${assetPath}`], { encoding: 'utf-8' });
    return JSON.parse(content).networkAddresses ?? {};
  } catch {
    // File didn't exist at the base commit (e.g. brand new version/module in this PR)
    return {};
  }
}

async function fetchPublicRpcs(chainId: string): Promise<string[]> {
  const response = await fetch('https://chainlist.org/rpcs.json');
  if (!response.ok) {
    throw new Error(`Failed to fetch chainlist from DefiLlama (HTTP ${response.status})`);
  }
  const chainlist = (await response.json()) as Array<{
    chainId: number;
    rpc: Array<{ url: string; tracking?: string }>;
  }>;
  const chain = chainlist.find((entry) => `${entry.chainId}` === chainId);
  const urls = (chain?.rpc ?? [])
    .filter(({ url }) => url.startsWith('http'))
    .sort((a, b) => (a.tracking === 'none' ? -1 : 1) - (b.tracking === 'none' ? -1 : 1))
    .map(({ url }) => url);
  if (urls.length === 0) {
    throw new Error(`No public RPC found for chain ID ${chainId} on DefiLlama's ChainList`);
  }
  return urls;
}

async function getBytecodeHash(chainId: string, address: string): Promise<`0x${string}`> {
  const rpcUrls = await fetchPublicRpcs(chainId);

  let lastError: unknown;
  for (const rpcUrl of rpcUrls.slice(0, 3)) {
    try {
      const client = createPublicClient({ transport: http(rpcUrl) });
      const code = await client.getCode({ address: address as `0x${string}` });
      if (!code || code === '0x') {
        throw new Error(`No bytecode deployed at ${address} on chain ${chainId}`);
      }
      return keccak256(code);
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(
    `Failed to fetch bytecode for chain ${chainId} after trying ${Math.min(rpcUrls.length, 3)} RPC(s): ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

async function main() {
  const { assetPath, base } = parseArgs();

  const oldNetworkAddresses = readNetworkAddressesAt(base, assetPath);
  const newContent = JSON.parse(await fs.readFile(assetPath, 'utf-8'));
  const newNetworkAddresses = newContent.networkAddresses as Record<string, string>;
  const contractName = newContent.contractName;

  const changedChainIds = Object.keys(newNetworkAddresses).filter(
    (chainId) => oldNetworkAddresses[chainId] !== newNetworkAddresses[chainId],
  );

  if (changedChainIds.length === 0) {
    console.log(`${contractName}: no networkAddresses changes in ${assetPath}, nothing to verify.`);
    return;
  }

  const referenceChainId = Object.keys(oldNetworkAddresses).find(
    (chainId) => !changedChainIds.includes(chainId) && oldNetworkAddresses[chainId] === newNetworkAddresses[chainId],
  );

  if (!referenceChainId) {
    console.warn(
      `⚠️  ${contractName}: no unchanged reference chain available in ${assetPath} — cannot cross-check ` +
        `bytecode for chain(s) ${changedChainIds.join(', ')}.`,
    );
    return;
  }

  console.log(`Reference chain: ${referenceChainId} (${oldNetworkAddresses[referenceChainId]})`);
  const referenceHash = await getBytecodeHash(referenceChainId, oldNetworkAddresses[referenceChainId]);
  console.log(`  hash: ${referenceHash}`);

  const problems: string[] = [];
  const okChainIds: string[] = [];
  for (const chainId of changedChainIds) {
    const address = newNetworkAddresses[chainId];
    try {
      const hash = await getBytecodeHash(chainId, address);
      console.log(`  chain ${chainId} (${address}): ${hash}`);
      if (hash !== referenceHash) {
        problems.push(`chain ${chainId} (${address}) has hash ${hash}, expected ${referenceHash}`);
      } else {
        okChainIds.push(chainId);
      }
    } catch (err) {
      problems.push(`chain ${chainId} (${address}): ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `${contractName}: ${problems.length} of ${changedChainIds.length} changed chain(s) failed verification ` +
        `against reference chain ${referenceChainId}:\n${problems.join('\n')}`,
    );
  }

  console.log(`✓ ${contractName}: chain(s) ${okChainIds.join(', ')} match reference chain ${referenceChainId}`);
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exitCode = 1;
});
