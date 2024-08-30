import { Flex, Menu, useToast, Text } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserApi } from '../../../../apis';
import { IconButton } from '../../../../components';
import { getNetworkName } from '../../../../components/NetworkIndicator';
import { supportedWallets } from '../../../../constants';
import { StorageHelper } from '../../../../helpers';
import { UserModel } from '../../../../shared/models';
import { setUser } from '../../../../store/actions';
import { getUser } from '../../../../store/selectors';
import './styles.scss';

const { connector } = supportedWallets.METAMASK;

interface IWalletConnected {
  account: string | undefined;
  chainId: number | undefined;
}

const WalletConnected: React.FC<IWalletConnected> = ({ account, chainId }) => {
  const web3React = useWeb3React();
  const toast = useToast();
  //Variables to check if chainId and account exist
  const isChainIdExist = chainId ? chainId : 0;
  const isAccountExist = account ? account : '';

  const provider = StorageHelper.getItem("provider");

  // Get dispatch from hook
  const dispatch = useDispatch();

  // Get user from store
  const userData = useSelector(getUser);

  const removeUserAccount = () => {
    const walletProfile = {
      accountWallet: undefined,
      chainId: 0,
    }
    if (userData && userData.id) {
      const result = [UserApi.updateProfile(userData.id, walletProfile)];
      Promise.all(result)
        .then(() => {
          const updatedUser = new UserModel({
            ...userData,
            ...walletProfile
          });
          dispatch(setUser(updatedUser));
        });
    }
  }

  const onLogout = () => {
    removeUserAccount();
    switch (provider) {
      case 'injected':
        web3React.deactivate();
        break;
      case 'walletConnect':
        connector.deactivate();
        break;
      case 'casper':
        window.casperlabsHelper.disconnectFromSite();
        break;
      default:
        break;
    }
  };

  const shortHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substr(0, 4)}—${hash.substr(-4)}`;
  };

  return (
    <div className="walletConnected-container">
      <Menu>
        <Flex mt={4} display="flex" flexDirection="column" fontSize={{ base: 'sm', md: 'lg' }}>
          <Text color="white">{getNetworkName(isChainIdExist)}</Text>
          <Flex my={2}>
            <Text mr={2}>{shortHash(isAccountExist)}</Text>
            <IconButton
              width="15px"
              height="15px"
              icon="copy"
              onClick={() => {
                navigator.clipboard.writeText(isAccountExist);
                return toast({
                  title: 'Copied!',
                  status: 'success'
                });
              }}
            />
          </Flex>
          <Text fontWeight={700} color="white" cursor="pointer" onClick={onLogout}>
            Disconnect wallet
          </Text>
        </Flex>
      </Menu>
    </div>
  );
};

export default WalletConnected;
