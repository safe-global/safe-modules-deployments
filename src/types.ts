export interface SingletonDeployment {
  version: string;
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
