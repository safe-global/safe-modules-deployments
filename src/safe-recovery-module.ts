import SocialRecoveryModule010 from './assets/safe-recovery-module/v0.1.0/social-recovery-module.json';
import { DeploymentFilter, Deployment } from './types';
import { applyFilterDefaults, findDeployment } from './utils';

// The array should be sorted from the latest version to the oldest.
const SOCIAL_RECOVERY_MODULE_DEPLOYMENTS: Deployment[] = [SocialRecoveryModule010];

export const getSocialRecoveryModuleDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), SOCIAL_RECOVERY_MODULE_DEPLOYMENTS);
};
