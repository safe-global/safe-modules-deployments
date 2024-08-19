import SafeWebAuthnSignerFactory021 from './assets/safe-passkey-module/v0.2.1/safe-webauthn-signer-factory.json';
import SafeWebAuthnSignerFactory020 from './assets/safe-passkey-module/v0.2.0/safe-webauthn-signer-factory.json';
import SafeWebAuthnSharedSigner021 from './assets/safe-passkey-module/v0.2.1/safe-webauthn-shared-signer.json';
import DaimoP256Verifier021 from './assets/safe-passkey-module/v0.2.1/daimo-p256-verifier.json';
import DaimoP256Verifier020 from './assets/safe-passkey-module/v0.2.0/daimo-p256-verifier.json';
import FCLP256Verifier021 from './assets/safe-passkey-module/v0.2.1/fcl-p256-verifier.json';
import FCLP256Verifier020 from './assets/safe-passkey-module/v0.2.0/fcl-p256-verifier.json';
import { DeploymentFilter, Deployment } from './types';
import { applyFilterDefaults, findDeployment } from './utils';

// The array should be sorted from the latest version to the oldest.
const SAFE_WEBAUTHN_SIGNER_FACTORY_DEPLOYMENTS: Deployment[] = [SafeWebAuthnSignerFactory021, SafeWebAuthnSignerFactory020];
const SAFE_WEBAUTHN_SHARED_SIGNER_DEPLOYMENTS: Deployment[] = [SafeWebAuthnSharedSigner021];
const DAIMO_P256_VERIFIER_DEPLOYMENTS: Deployment[] = [DaimoP256Verifier021, DaimoP256Verifier020];
const FCL_P256_VERIFIER_DEPLOYMENTS: Deployment[] = [FCLP256Verifier021, FCLP256Verifier020];

export const getSafeWebAuthnSignerFactoryDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), SAFE_WEBAUTHN_SIGNER_FACTORY_DEPLOYMENTS);
};

export const getSafeWebAuthnShareSignerDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), SAFE_WEBAUTHN_SHARED_SIGNER_DEPLOYMENTS);
};

export const getDaimoP256VerifierDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), DAIMO_P256_VERIFIER_DEPLOYMENTS);
};

export const getFCLP256VerifierDeployment = (filter?: DeploymentFilter): Deployment | undefined => {
  return findDeployment(applyFilterDefaults(filter), FCL_P256_VERIFIER_DEPLOYMENTS);
};
