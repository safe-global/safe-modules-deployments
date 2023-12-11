import Safe4337Module020 from './assets/safe-4337-module/v0.2.0/safe-4337-module.json';
import AddModulesLib020 from './assets/safe-4337-module/v0.2.0/add-modules-lib.json';
import { DeploymentFilter, Deployment } from './types';
import { applyFilterDefaults, findDeployment } from './utils';

// The array should be sorted from the latest version to the oldest.
const SAFE_4337_MODULE_DEPLOYMENTS: Deployment[] = [Safe4337Module020];
const ADD_MODULES_LIB_DEPLOYMENTS: Deployment[] = [AddModulesLib020];

export const getSafe4337ModuleDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), SAFE_4337_MODULE_DEPLOYMENTS);
};

export const getAddModulesLibDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), ADD_MODULES_LIB_DEPLOYMENTS);
};
