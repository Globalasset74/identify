/* eslint-disable no-alert */
import { FC, useContext } from 'react';
import { Card, ReconnectButton } from '../../components';
import { MetaMaskContext } from '../../contexts/MetamaskContext';
import { shouldDisplayReconnectButton } from '../../utils';

type Props = {
  handleConnectClick: () => Promise<void>;
};

const ReconnectIdentitySnap: FC<Props> = ({ handleConnectClick }) => {
  const [state] = useContext(MetaMaskContext);

  return shouldDisplayReconnectButton(state.installedSnap) ? (
    <Card
      content={{
        title: 'Reconnect to Identity Snap',
        description:
          "While connected to a local running snap, this button will always be displayed in order to update the snap if a change is made. Note that you'll need to reconnect if you switch the network on Metamask at any point in time as that will cause your metamask state to change",
        button: (
          <ReconnectButton
            onClick={handleConnectClick}
            disabled={!state.installedSnap}
          />
        ),
      }}
      disabled={!state.installedSnap}
    />
  ) : null;
};

export default ReconnectIdentitySnap;