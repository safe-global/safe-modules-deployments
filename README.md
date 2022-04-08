# Gnosis Safe Modules Deployments

[![npm version](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-modules-deployments.svg)](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-modules-deployments)

This contract contains a collection of deployments of audited contracts from the [Safe modules repository](https://github.com/gnosis/safe-modules).

For each deployment the address on the different networks and the abi files are available. To get an overview of the available versions check the available [json assets](./src/assets/).

To add additional deployments please follow the [deployment steps in the module folder in the Safe modules repository](https://github.com/gnosis/safe-modules).

## Install

- npm - `npm i @gnosis.pm/safe-modules-deployments`
- yarn - `yarn add @gnosis.pm/safe-modules-deployments`

## Usage

It is possible to directly use the json files in the [assets folder](./src/assets/) that contain the addresses and abi definitions.

An alternative is to use the JavaScript library methods to query the correct deployment. The library supports different methods to get the deployment of a specific contract.

Each of the method takes an optional `DeploymentFilter` as a parameter.

```ts
interface DeploymentFilter {
  version?: string;
  released?: boolean; // Defaults to true if no filter is specified
  network?: string; // Chain id of the network
}
```

The method will return a `SingletonDeployment` object or `undefined` if no deployment was found for the specified filter.

```ts
interface SingletonDeployment {
  version: string;
  abi: any[];
  networkAddresses: Record<string, string>; // Address of the contract by network
  contractName: string;
  released: boolean; // A released version was audited and has a running bug bounty
}
```

- Allowance Module

```ts
const allowanceModule = getAllowanceModuleDeployment();

// Returns latest contract version, even if not finally released yet
const allowanceModuleNightly = getAllowanceModuleDeployment({ released: undefined });

// Returns released contract version for specific network
const allowanceModuleGörli = getAllowanceModuleDeployment({ network: '5' });

// Returns released contract version for specific version
const allowanceModule010 = getAllowanceModuleDeployment({ version: '0.1.0' });
```

## Notes

A list of network information can be found at [chainid.network](https://chainid.network/)

## License

This library is released under MIT.
