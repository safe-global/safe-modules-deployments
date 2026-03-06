import { findDeployment, applyFilterDefaults } from '../utils';
import { Deployment } from '../types';

const DEPLOYMENT_V1: Deployment = {
  version: '1.0.0',
  released: true,
  contractName: 'TestContract',
  abi: [],
  networkAddresses: { '1': '0xAAAA', '137': '0xBBBB' },
};

const DEPLOYMENT_V2: Deployment = {
  version: '2.0.0',
  released: false,
  contractName: 'TestContract',
  abi: [],
  networkAddresses: { '1': '0xCCCC' },
};

const DEPLOYMENTS = [DEPLOYMENT_V2, DEPLOYMENT_V1];

describe('applyFilterDefaults', () => {
  it('returns { released: true } when called with no argument', () => {
    expect(applyFilterDefaults()).toEqual({ released: true });
  });

  it('returns { released: true } when called with undefined', () => {
    expect(applyFilterDefaults(undefined)).toEqual({ released: true });
  });

  it('returns the filter as-is when an explicit filter is provided', () => {
    expect(applyFilterDefaults({ version: '1.0.0' })).toEqual({ version: '1.0.0' });
  });

  it('preserves released: false when explicitly set', () => {
    expect(applyFilterDefaults({ released: false })).toEqual({ released: false });
  });
});

describe('findDeployment', () => {
  it('returns the first (latest) deployment with no filter', () => {
    expect(findDeployment({}, DEPLOYMENTS)).toBe(DEPLOYMENT_V2);
  });

  it('filters by version', () => {
    expect(findDeployment({ version: '1.0.0' }, DEPLOYMENTS)).toBe(DEPLOYMENT_V1);
  });

  it('returns undefined for an unknown version', () => {
    expect(findDeployment({ version: '9.9.9' }, DEPLOYMENTS)).toBeUndefined();
  });

  it('filters by released: true', () => {
    expect(findDeployment({ released: true }, DEPLOYMENTS)).toBe(DEPLOYMENT_V1);
  });

  it('filters by released: false', () => {
    expect(findDeployment({ released: false }, DEPLOYMENTS)).toBe(DEPLOYMENT_V2);
  });

  it('filters by network', () => {
    expect(findDeployment({ network: '137' }, DEPLOYMENTS)).toBe(DEPLOYMENT_V1);
  });

  it('returns undefined for an unknown network', () => {
    expect(findDeployment({ network: '9999' }, DEPLOYMENTS)).toBeUndefined();
  });

  it('combines version and network filters', () => {
    expect(findDeployment({ version: '1.0.0', network: '137' }, DEPLOYMENTS)).toBe(DEPLOYMENT_V1);
  });

  it('returns undefined when version matches but network does not', () => {
    expect(findDeployment({ version: '1.0.0', network: '9999' }, DEPLOYMENTS)).toBeUndefined();
  });

  it('returns undefined for an empty deployments list', () => {
    expect(findDeployment({}, [])).toBeUndefined();
  });
});
