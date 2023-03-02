/* eslint-disable no-alert */
import { FC, useContext, useState } from 'react';
import { Card, SendHelloButton } from '../../components';
import {
  MetamaskActions,
  MetaMaskContext,
} from '../../contexts/MetamaskContext';
import { shouldDisplayReconnectButton, syncGoogleVCs } from '../../utils';
import { validHederaChainID } from '../../utils/hedera';

type Props = {
  currentChainId: string;
  hederaAccountConnected: boolean;
};

const SyncGoogleVCs: FC<Props> = ({
  currentChainId,
  hederaAccountConnected,
}) => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [loading, setLoading] = useState(false);

  const handleSyncGoogleVCs = async () => {
    setLoading(true);
    try {
      const resp = await syncGoogleVCs();
      console.log('Synced with google drive: ', resp);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
    setLoading(false);
  };

  return (validHederaChainID(currentChainId) && hederaAccountConnected) ||
    (!validHederaChainID(currentChainId) && !hederaAccountConnected) ? (
    <Card
      content={{
        title: 'syncGoogleVCs',
        description: 'Sync VCs with google drive',
        button: (
          <SendHelloButton
            buttonText="Sync Google VCs"
            onClick={handleSyncGoogleVCs}
            disabled={!state.installedSnap}
            loading={loading}
          />
        ),
      }}
      disabled={!state.installedSnap}
      fullWidth={
        state.isFlask &&
        Boolean(state.installedSnap) &&
        !shouldDisplayReconnectButton(state.installedSnap)
      }
    />
  ) : null;
};

export default SyncGoogleVCs;