import { IDataManagerClearResult } from '@tuum-tech/identity-snap/src/veramo/plugins/verfiable-creds-manager';
import { FC, useContext, useState } from 'react';
import Select from 'react-select';
import { storeOptions } from '../../config/constants';
import {
  MetamaskActions,
  MetaMaskContext,
} from '../../contexts/MetamaskContext';
import { VcContext } from '../../contexts/VcContext';
import {
  deleteAllVCs,
  getCurrentNetwork,
  shouldDisplayReconnectButton,
} from '../../utils';
import { Card, SendHelloButton } from '../base';

type Props = {
  setCurrentChainId: React.Dispatch<React.SetStateAction<string>>;
};

const DeleteAllVCs: FC<Props> = ({ setCurrentChainId }) => {
  const { setVcId, setVcIdsToBeRemoved } = useContext(VcContext);
  const [state, dispatch] = useContext(MetaMaskContext);
  const [selectedOptions, setSelectedOptions] = useState([storeOptions[0]]);
  const [loading, setLoading] = useState(false);

  const handleChange = (options: any) => {
    setSelectedOptions(options);
  };

  const handleDeleteAllVCsClick = async () => {
    setLoading(true);
    try {
      setCurrentChainId(await getCurrentNetwork());
      const selectedStore = selectedOptions.map((option) => option.value);
      const options = {
        // If you want to remove the VCs from multiple stores, you can pass an array like so:
        // store: ['snap', 'googleDrive'],
        ...(selectedStore.length ? { store: selectedStore } : {}),
      };
      const isRemoved = (await deleteAllVCs(
        options,
      )) as IDataManagerClearResult[];
      console.log(`Remove VC Result: ${JSON.stringify(isRemoved, null, 4)}`);
      setVcId('');
      setVcIdsToBeRemoved('');
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
    setLoading(false);
  };

  return (
    <Card
      content={{
        title: 'deleteAllVCs',
        description: 'Delete all the VCs from the snap',
        form: (
          <form>
            <label>Select store</label>
            <Select
              closeMenuOnSelect
              isMulti
              isSearchable={false}
              isClearable={false}
              options={storeOptions}
              value={selectedOptions}
              onChange={handleChange}
              styles={{
                control: (base: any) => ({
                  ...base,
                  border: `1px solid grey`,
                  marginBottom: 8,
                }),
              }}
            />
          </form>
        ),
        button: (
          <SendHelloButton
            buttonText="Delete all VCs"
            onClick={handleDeleteAllVCsClick}
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

export { DeleteAllVCs };
