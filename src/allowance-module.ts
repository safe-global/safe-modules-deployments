import AllowanceModule100 from './assets/allowance-module/v0.1.0/allowance-module.json';
import { DeploymentFilter, SingletonDeployment } from './types';
import { applyFilterDefaults, findDeployment } from './utils';

// The array should be sorted from the latest version to the oldest.
const ALLOWANCE_MODULE_DEPLOYMENTS: SingletonDeployment[] = [AllowanceModule100];

export const getAllowanceModuleDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), ALLOWANCE_MODULE_DEPLOYMENTS);
};
