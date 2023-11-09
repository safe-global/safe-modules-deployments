import AllowanceModule010 from './assets/allowance-module/v0.1.0/allowance-module.json';
import { DeploymentFilter, Deployment } from './types';
import { applyFilterDefaults, findDeployment } from './utils';

// The array should be sorted from the latest version to the oldest.
const ALLOWANCE_MODULE_DEPLOYMENTS: Deployment[] = [AllowanceModule010];

export const getAllowanceModuleDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), ALLOWANCE_MODULE_DEPLOYMENTS);
};
