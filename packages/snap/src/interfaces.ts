import { IIdentifier, IKey, VerifiableCredential } from '@veramo/core';
import { ManagedPrivateKey } from '@veramo/key-manager';

export type IdentitySnapState = {
  /**
   * Account specific storage
   */
  accountState: Record<string, IdentityAccountState>;

  /**
   * Configuration for IdentitySnap
   */
  snapConfig: IdentitySnapConfig;
};

export interface IdentitySnapConfig {
  snap: {
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    friendlyDapps: Array<string>;
  };
}

/**
 * Identity Snap State for a MetaMask address
 */
export interface IdentityAccountState {
  snapPrivateKeyStore: Record<string, ManagedPrivateKey>;
  snapKeyStore: Record<string, IKey>;
  identifiers: Record<string, IIdentifier>;
  vcs: Record<string, VerifiableCredential>;
  publicKey: string;
  accountConfig: IdentityAccountConfig;
}

export interface IdentityAccountConfig {
  didMethod: string;
  vcStore: string;
}

export type SnapConfirmParams = {
  prompt: string;
  description?: string;
  textAreaContent?: string;
};