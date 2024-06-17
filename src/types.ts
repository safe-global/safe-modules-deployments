export interface Deployment {
  version: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  abi: any[];
  networkAddresses: Record<string, string>;
  contractName: string;
  released: boolean;
}

export interface DeploymentFilter {
  version?: string;
  released?: boolean;
  network?: string;
}
