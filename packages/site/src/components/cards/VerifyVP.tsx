import { FC, useContext, useState } from 'react';
import {
  MetamaskActions,
  MetaMaskContext,
} from '../../contexts/MetamaskContext';
import { VcContext } from '../../contexts/VcContext';
import useModal from '../../hooks/useModal';
import {
  getCurrentNetwork,
  shouldDisplayReconnectButton,
  verifyVP,
} from '../../utils';
import { Card, SendHelloButton, TextInput } from '../base';

type Props = {
  setCurrentChainId: React.Dispatch<React.SetStateAction<string>>;
};

const VerifyVP: FC<Props> = ({ setCurrentChainId }) => {
  const { vp, setVp } = useContext(VcContext);
  const [state, dispatch] = useContext(MetaMaskContext);
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  const handleVerifyVPClick = async () => {
    setLoading(true);
    try {
      setCurrentChainId(await getCurrentNetwork());
      const verified = await verifyVP(vp);
      console.log('VP Verified: ', verified);
      showModal({
        title: 'Verify VP',
        content: `VP Verified: ${verified}`,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
    setLoading(false);
  };

  return (
    <Card
      content={{
        title: 'verifyVP',
        description: 'Verify a VP JWT or LDS format',
        form: (
          <form>
            <label>
              Enter your Verifiable Presentation
              <TextInput
                rows={2}
                value={JSON.stringify(vp)}
                onChange={(e) => setVp(e.target.value)}
                fullWidth
              />
            </label>
          </form>
        ),
        button: (
          <SendHelloButton
            buttonText="Verify VP"
            onClick={handleVerifyVPClick}
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
  );
};

export { VerifyVP };