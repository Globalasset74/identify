import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';
import {
  EvmAccountParams,
  ExternalAccount,
  HederaAccountParams,
  IdentitySnapParams,
} from './interfaces';
import { connectEVMAccount } from './rpc/account/connectEvmAccount';
import { connectHederaAccount } from './rpc/account/connectHederaAccount';
import { getAccountInfo } from './rpc/account/getAccountInfo';
import { getAvailableMethods } from './rpc/did/getAvailableMethods';
import { getCurrentDIDMethod } from './rpc/did/getCurrentDIDMethod';
import { getDid } from './rpc/did/getDID';
import { resolveDID } from './rpc/did/resolveDID';
import { switchMethod } from './rpc/did/switchMethods';
import { configureGoogleAccount } from './rpc/gdrive/configureGoogleAccount';
import { createNewHederaAccount } from './rpc/hedera/createNewHederaAccount';
import { togglePopups } from './rpc/snap/togglePopups';
import { createVC } from './rpc/vc/createVC';
import { createVP } from './rpc/vc/createVP';
import { deleteAllVCs } from './rpc/vc/deleteAllVCs';
import { getSupportedProofFormats } from './rpc/vc/getSupportedProofFormats';
import { getVCs } from './rpc/vc/getVCs';
import { removeVC } from './rpc/vc/removeVC';
import { saveVC } from './rpc/vc/saveVC';
import { syncGoogleVCs } from './rpc/vc/syncGoogleVCs';
import { verifyVC } from './rpc/vc/verifyVC';
import { verifyVP } from './rpc/vc/verifyVP';
import { getCurrentAccount } from './snap/account';
import { getSnapStateUnchecked } from './snap/state';
import { CreateNewHederaAccountRequestParams } from './types/params';
import { init } from './utils/init';
import {
  isExternalAccountFlagSet,
  isValidConfigueGoogleRequest,
  isValidCreateNewHederaAccountParams,
  isValidCreateVCRequest,
  isValidCreateVPRequest,
  isValidDeleteAllVCsRequest,
  isValidEVMAccountParams,
  isValidGetVCsRequest,
  isValidHederaAccountParams,
  isValidRemoveVCRequest,
  isValidResolveDIDRequest,
  isValidSaveVCRequest,
  isValidSwitchMethodRequest,
  isValidVerifyVCRequest,
  isValidVerifyVPRequest,
} from './utils/params';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.request - A validated JSON-RPC request object.
 * @param args.origin - Origin of the request.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log('Request:', JSON.stringify(request, null, 4));
  console.log('Origin:', origin);
  console.log('-------------------------------------------------------------');
  console.log(
    'request.params=========',
    JSON.stringify(request.params, null, 4),
  );

  let state = await getSnapStateUnchecked(snap);
  if (state === null) {
    state = await init(snap);
  }
  console.log('state:', JSON.stringify(state, null, 4));

  let extraData: unknown;
  if (isExternalAccountFlagSet(request.params)) {
    if (
      !(
        isValidHederaAccountParams(request.params) ||
        isValidEVMAccountParams(request.params)
      )
    ) {
      throw new Error('External Account parameter is invalid');
    }
    extraData = (request.params as ExternalAccount).externalAccount.data;
  }

  const account = await getCurrentAccount(
    state,
    request.params as ExternalAccount,
  );
  account.extraData = extraData;

  console.log(
    `Currently connected account: ${JSON.stringify(account, null, 4)}`,
  );

  const identitySnapParams: IdentitySnapParams = {
    snap,
    state,
    metamask: ethereum,
    account,
  };

  switch (request.method) {
    case 'hello': {
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Alert', // Type can be 'Alert', 'Confirmation' or 'Prompt'
          content: panel([
            heading('This is what the header looks like'),
            text('This is what text area looks like before the divider'),
            divider(),
            text('This is what text area looks like after the divider'),
          ]),
        },
      });
    }

    case 'togglePopups': {
      return await togglePopups(identitySnapParams);
    }

    case 'getAccountInfo': {
      return await getAccountInfo(identitySnapParams);
    }

    case 'connectEVMAccount': {
      if (!isValidEVMAccountParams(request.params)) {
        throw new Error('External Account parameter is invalid');
      }
      return await connectEVMAccount(
        state,
        (extraData as EvmAccountParams).address,
        false,
      );
    }

    case 'connectHederaAccount': {
      if (!isValidHederaAccountParams(request.params)) {
        throw new Error('External Account parameter is invalid');
      }
      return await connectHederaAccount(
        state,
        (extraData as HederaAccountParams).accountId,
        false,
      );
    }

    case 'createNewHederaAccount': {
      isValidCreateNewHederaAccountParams(request.params);
      return await createNewHederaAccount(
        identitySnapParams,
        request.params as CreateNewHederaAccountRequestParams,
      );
    }

    case 'getDID': {
      return await getDid(identitySnapParams);
    }

    case 'resolveDID': {
      isValidResolveDIDRequest(request.params);
      return await resolveDID(identitySnapParams, request.params.did);
    }

    case 'getVCs': {
      isValidGetVCsRequest(request.params);
      return await getVCs(identitySnapParams, request.params);
    }

    case 'saveVC': {
      isValidSaveVCRequest(request.params);
      return await saveVC(identitySnapParams, request.params);
    }

    case 'createVC': {
      isValidCreateVCRequest(request.params);
      return await createVC(identitySnapParams, request.params);
    }

    case 'verifyVC': {
      isValidVerifyVCRequest(request.params);
      return await verifyVC(
        identitySnapParams,
        request.params.verifiableCredential,
      );
    }

    case 'removeVC': {
      isValidRemoveVCRequest(request.params);
      return await removeVC(identitySnapParams, request.params);
    }

    case 'deleteAllVCs': {
      isValidDeleteAllVCsRequest(request.params);
      return await deleteAllVCs(identitySnapParams, request.params);
    }

    case 'createVP': {
      isValidCreateVPRequest(request.params);
      return await createVP(identitySnapParams, request.params);
    }

    case 'verifyVP': {
      isValidVerifyVPRequest(request.params);
      return await verifyVP(
        identitySnapParams,
        request.params.verifiablePresentation,
      );
    }

    case 'getAvailableMethods': {
      return getAvailableMethods();
    }

    case 'getCurrentDIDMethod': {
      return getCurrentDIDMethod(identitySnapParams);
    }

    case 'switchMethod': {
      isValidSwitchMethodRequest(request.params);
      return await switchMethod(identitySnapParams, request.params.didMethod);
    }

    case 'getSupportedProofFormats': {
      return getSupportedProofFormats();
    }

    case 'configureGoogleAccount': {
      isValidConfigueGoogleRequest(request.params);
      return await configureGoogleAccount(identitySnapParams, request.params);
    }

    case 'syncGoogleVCs': {
      return await syncGoogleVCs(identitySnapParams);
    }

    default: {
      console.error('Method not found');
      throw new Error('Method not found');
    }
  }
};
