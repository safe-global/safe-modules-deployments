import { getAllowanceModuleDeployment } from '../allowance-module';
import {
  getSafe4337ModuleDeployment,
  getSafeModuleSetupDeployment,
  getAddModulesLibDeployment,
} from '../safe-4337-module';
import {
  getSafeWebAuthnSignerFactoryDeployment,
  getSafeWebAuthnShareSignerDeployment,
  getDaimoP256VerifierDeployment,
  getFCLP256VerifierDeployment,
} from '../safe-passkey-module';
import { getSocialRecoveryModuleDeployment } from '../safe-recovery-module';

// Chain IDs confirmed present in the asset JSON files
const CHAIN_MAINNET = '1';
const CHAIN_GNOSIS = '100';
const CHAIN_OPTIMISM = '10';
const CHAIN_UNKNOWN = '999999';

describe('getAllowanceModuleDeployment', () => {
  it('returns the latest released deployment by default', () => {
    const deployment = getAllowanceModuleDeployment();
    expect(deployment).toBeDefined();
    expect(deployment?.released).toBe(true);
    expect(deployment?.version).toBe('0.1.1');
  });

  it('returns deployment for a known network', () => {
    const deployment = getAllowanceModuleDeployment({ network: CHAIN_GNOSIS });
    expect(deployment).toBeDefined();
    expect(deployment?.networkAddresses[CHAIN_GNOSIS]).toBeDefined();
  });

  it('returns undefined for an unknown network', () => {
    expect(getAllowanceModuleDeployment({ network: CHAIN_UNKNOWN })).toBeUndefined();
  });

  it('returns v0.1.0 when explicitly requested', () => {
    const deployment = getAllowanceModuleDeployment({ version: '0.1.0' });
    expect(deployment?.version).toBe('0.1.0');
  });
});

describe('getSafe4337ModuleDeployment', () => {
  it('returns the latest released deployment by default', () => {
    const deployment = getSafe4337ModuleDeployment();
    expect(deployment).toBeDefined();
    expect(deployment?.released).toBe(true);
    expect(deployment?.version).toBe('0.3.0');
  });

  it('returns deployment for mainnet', () => {
    const deployment = getSafe4337ModuleDeployment({ network: CHAIN_MAINNET });
    expect(deployment).toBeDefined();
    expect(deployment?.networkAddresses[CHAIN_MAINNET]).toBeDefined();
  });

  it('returns undefined for an unknown network', () => {
    expect(getSafe4337ModuleDeployment({ network: CHAIN_UNKNOWN })).toBeUndefined();
  });

  it('returns v0.2.0 when explicitly requested', () => {
    const deployment = getSafe4337ModuleDeployment({ version: '0.2.0' });
    expect(deployment?.version).toBe('0.2.0');
  });
});

describe('getSafeModuleSetupDeployment', () => {
  it('returns the latest released deployment by default', () => {
    const deployment = getSafeModuleSetupDeployment();
    expect(deployment).toBeDefined();
    expect(deployment?.released).toBe(true);
  });

  it('returns deployment for mainnet', () => {
    const deployment = getSafeModuleSetupDeployment({ network: CHAIN_MAINNET });
    expect(deployment).toBeDefined();
  });

  it('returns undefined for an unknown network', () => {
    expect(getSafeModuleSetupDeployment({ network: CHAIN_UNKNOWN })).toBeUndefined();
  });
});

describe('getAddModulesLibDeployment', () => {
  it('is an alias for getSafeModuleSetupDeployment', () => {
    expect(getAddModulesLibDeployment()).toEqual(getSafeModuleSetupDeployment());
  });
});

describe('getSafeWebAuthnSignerFactoryDeployment', () => {
  it('returns the latest released deployment by default', () => {
    const deployment = getSafeWebAuthnSignerFactoryDeployment();
    expect(deployment).toBeDefined();
    expect(deployment?.released).toBe(true);
    expect(deployment?.version).toBe('0.2.1');
  });

  it('returns deployment for mainnet', () => {
    const deployment = getSafeWebAuthnSignerFactoryDeployment({ network: CHAIN_MAINNET });
    expect(deployment).toBeDefined();
  });

  it('returns undefined for an unknown network', () => {
    expect(getSafeWebAuthnSignerFactoryDeployment({ network: CHAIN_UNKNOWN })).toBeUndefined();
  });
});

describe('getSafeWebAuthnShareSignerDeployment', () => {
  it('returns a deployment by default', () => {
    const deployment = getSafeWebAuthnShareSignerDeployment();
    expect(deployment).toBeDefined();
    expect(deployment?.released).toBe(true);
  });

  it('returns undefined for an unknown network', () => {
    expect(getSafeWebAuthnShareSignerDeployment({ network: CHAIN_UNKNOWN })).toBeUndefined();
  });
});

describe('getDaimoP256VerifierDeployment', () => {
  it('returns the latest released deployment by default', () => {
    const deployment = getDaimoP256VerifierDeployment();
    expect(deployment).toBeDefined();
    expect(deployment?.released).toBe(true);
    expect(deployment?.version).toBe('0.2.1');
  });

  it('returns undefined for an unknown network', () => {
    expect(getDaimoP256VerifierDeployment({ network: CHAIN_UNKNOWN })).toBeUndefined();
  });
});

describe('getFCLP256VerifierDeployment', () => {
  it('returns the latest released deployment by default', () => {
    const deployment = getFCLP256VerifierDeployment();
    expect(deployment).toBeDefined();
    expect(deployment?.released).toBe(true);
    expect(deployment?.version).toBe('0.2.1');
  });

  it('returns undefined for an unknown network', () => {
    expect(getFCLP256VerifierDeployment({ network: CHAIN_UNKNOWN })).toBeUndefined();
  });
});

describe('getSocialRecoveryModuleDeployment', () => {
  it('returns the latest released deployment by default', () => {
    const deployment = getSocialRecoveryModuleDeployment();
    expect(deployment).toBeDefined();
    expect(deployment?.released).toBe(true);
    expect(deployment?.version).toBe('0.1.0');
  });

  it('returns deployment for Optimism', () => {
    const deployment = getSocialRecoveryModuleDeployment({ network: CHAIN_OPTIMISM });
    expect(deployment).toBeDefined();
    expect(deployment?.networkAddresses[CHAIN_OPTIMISM]).toBeDefined();
  });

  it('returns undefined for an unknown network', () => {
    expect(getSocialRecoveryModuleDeployment({ network: CHAIN_UNKNOWN })).toBeUndefined();
  });
});
