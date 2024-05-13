import Safe4337Module030 from './assets/safe-4337-module/v0.3.0/safe-4337-module.json';
import Safe4337Module020 from './assets/safe-4337-module/v0.2.0/safe-4337-module.json';
import SafeModuleSetup030 from './assets/safe-4337-module/v0.3.0/safe-module-setup.json';
import AddModulesLib020 from './assets/safe-4337-module/v0.2.0/add-modules-lib.json';
import { DeploymentFilter, Deployment } from './types';
import { applyFilterDefaults, findDeployment } from './utils';

// The array should be sorted from the latest version to the oldest.
const SAFE_4337_MODULE_DEPLOYMENTS: Deployment[] = [Safe4337Module030, Safe4337Module020];
const SAFE_MODULE_SETUP_DEPLOYMENTS: Deployment[] = [SafeModuleSetup030, AddModulesLib020];

export const getSafe4337ModuleDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), SAFE_4337_MODULE_DEPLOYMENTS);
};

export const getSafeModuleSetupDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), SAFE_MODULE_SETUP_DEPLOYMENTS);
};

// From v0.2 to v0.3, the `AddModulesLib` contract was renamed to `SafeModuleSetup` while preserving
// its interface and functionality. As such, we consider both contracts to be the same with respect
// to deployments, and expose an alias for the `AddModulesLib` name for backwards compatibility.
export const getAddModulesLibDeployment = getSafeModuleSetupDeployment;
