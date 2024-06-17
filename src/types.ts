export interface Deployment {
  defaultAddress: string;
  released: boolean;
  contractName: string;
  version: string;
  networkAddresses: Record<string, string>;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  abi: any[];
}

export interface DeploymentFilter {
  version?: string;
  released?: boolean;
  network?: string;
}
