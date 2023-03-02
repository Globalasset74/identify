import { useContext, useEffect, useState } from 'react';

import {
  Card,
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
} from '../components';
import {
  CardContainer,
  Container,
  ErrorMessage,
  Heading,
  Span,
  Subtitle,
} from '../config/styles';
import { MetamaskActions, MetaMaskContext } from '../contexts/MetamaskContext';
import { VcContext } from '../contexts/VcContext';
import {
  connectSnap,
  getCurrentNetwork,
  getSnap,
  shouldDisplayReconnectButton,
} from '../utils';
import { validHederaChainID } from '../utils/hedera';
import ConfigureGoogleAccount from './cards/ConfigureGoogleAccount';
import ConnectHederaAccount from './cards/ConnectHederaAccount';
import CreateVC from './cards/CreateVC';
import DeleteAllVCs from './cards/DeleteAllVCs';
import GetAllVCs from './cards/GetAllVCs';
import GetCurrentDIDMethod from './cards/GetCurrentDIDMethod';
import GetDID from './cards/GetDID';
import GetHederaAccountId from './cards/GetHederaAccountId';
import GetSpecificVC from './cards/GetSpecificVC';
import GetVP from './cards/GetVP';
import RemoveVC from './cards/RemoveVC';
import ResolveDID from './cards/ResolveDID';
import SendHelloHessage from './cards/SendHelloHessage';
import SyncGoogleVCs from './cards/SyncGoogleVCs';
import Todo from './cards/Todo';
import ToggleMetamaskPopups from './cards/ToggleMetamaskPopups';
import VerifyVC from './cards/VerifyVC';
import VerifyVP from './cards/VerifyVP';

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [currentChainId, setCurrentChainId] = useState('');
  const [hederaAccountConnected, setHederaAccountConnected] = useState(false);

  const {
    vcId,
    setVcId,
    vc,
    setVc,
    vcIdsToBeRemoved,
    setVcIdsToBeRemoved,
    vp,
    setVp,
  } = useContext(VcContext);

  useEffect(() => {
    if (!validHederaChainID(currentChainId)) {
      setHederaAccountConnected(false);
    }
  }, [currentChainId]);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      setCurrentChainId(await getCurrentNetwork());
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>Identity Snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle>
      {state.error && (
        <ErrorMessage>
          <b>An error happened:</b> {state.error.message}
        </ErrorMessage>
      )}
      <CardContainer>
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install Metamask Flask',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect to Identity Snap',
              description:
                'Get started by connecting to and installing the Identity Snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
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
        )}
        {/* =============================================================================== */}
        <ConnectHederaAccount
          currentChainId={currentChainId}
          hederaAccountConnected={hederaAccountConnected}
          setHederaAccountConnected={setHederaAccountConnected}
        />
        <SendHelloHessage
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <ToggleMetamaskPopups
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <GetCurrentDIDMethod
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <GetDID
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <ResolveDID
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <GetSpecificVC
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <GetAllVCs
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <CreateVC
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <VerifyVC
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <RemoveVC
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <DeleteAllVCs
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <GetVP
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <VerifyVP
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <GetHederaAccountId
          currentChainId={currentChainId}
          setCurrentChainId={setCurrentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <ConfigureGoogleAccount
          currentChainId={currentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <SyncGoogleVCs
          currentChainId={currentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <Todo
          currentChainId={currentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <Todo
          currentChainId={currentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
        <Todo
          currentChainId={currentChainId}
          hederaAccountConnected={hederaAccountConnected}
        />
      </CardContainer>
    </Container>
  );
};

export default Index;
