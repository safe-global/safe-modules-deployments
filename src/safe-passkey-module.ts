import SafeWebAuthnSignerFactory020 from './assets/safe-passkey-module/v0.2.0/safe-webauthn-signer-factory.json';
import DaimoP256Verifier020 from './assets/safe-passkey-module/v0.2.0/daimo-p256-verifier.json';
import FCLP256Verifier020 from './assets/safe-passkey-module/v0.2.0/fcl-p256-verifier.json';
import { DeploymentFilter, Deployment } from './types';
import { applyFilterDefaults, findDeployment } from './utils';

// The array should be sorted from the latest version to the oldest.
const SAFE_WEBAUTHN_SIGNER_FACTORY_DEPLOYMENTS: Deployment[] = [SafeWebAuthnSignerFactory020];
const DAIMO_P256_VERIFIER_DEPLOYMENTS: Deployment[] = [DaimoP256Verifier020];
const FCL_P256_VERIFIER_DEPLOYMENTS: Deployment[] = [FCLP256Verifier020];

export const getSafeWebAuthnSignerFactoryDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), SAFE_WEBAUTHN_SIGNER_FACTORY_DEPLOYMENTS);
};

export const getDaimoP256VerifierDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), DAIMO_P256_VERIFIER_DEPLOYMENTS);
};

export const getFCLP256VerifierDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), FCL_P256_VERIFIER_DEPLOYMENTS);
};
