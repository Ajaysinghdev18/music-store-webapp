import React  from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  Modal,
  Box,
  SimpleGrid,
  useToast
} from '@chakra-ui/core';
import { Alert, IconButton } from '../../../../components';
import {
  codeOfProduct,
  injected,
  METAMASK_FAQS_URL,
  privacyPolicy,
  termsOfService,
  walletConnect
} from '../../../../constants';
// Styles
import './styles.scss';
import { StorageHelper } from '../../../../helpers';
import { UserApi } from '../../../../apis';
import { UserModel } from '../../../../shared/models';
import { IUser } from '../../../../shared/interfaces';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../store/actions';
import { Link } from 'react-router-dom';
import { Signer } from 'casper-js-sdk';

interface IConnectWalletModalProps {
  onClose: () => void;
  userData: IUser | null;
  isOpen: boolean;
}

const ConnectWalletModal: React.FC<IConnectWalletModalProps> = ({ onClose, userData, isOpen }) => {
  const { activate } = useWeb3React();
  const toast = useToast();

  // Get dispatch from hook
  const dispatch = useDispatch();

  //web3react walletconnect
  const setProvider = (type: any) => {
    StorageHelper.setItem("provider", type)
  }
  const connectWalletConnect = async () => {
    try {
      await activate(walletConnect, undefined, true);
      setProvider("walletConnect")
      const walletConnectRes = StorageHelper.getItem('walletconnect');
      if (userData && userData.id && walletConnectRes && walletConnectRes.connected) {
        const walletProfile = {
          accountWallet: walletConnectRes.accounts[0],
          chainId: walletConnectRes.chainId
        };
        const result = [UserApi.updateProfile(userData.id, walletProfile)];
        Promise.all(result)
          .then(() => {
            const updatedUser = new UserModel({
              ...userData,
              ...walletProfile
            });
            dispatch(setUser(updatedUser));
            toast({
              position: 'top-right',
              render: ({ onClose }) => <Alert message="Successfully Updated" onClose={onClose} />
            });
          })
          .catch((err) => {
            const message = err.msg || 'Something went wrong';
            toast({
              position: 'top-right',
              render: ({ onClose }) => <Alert message={message} color="red" onClose={onClose} />
            });
          });
      }
      onClose();
    } catch (error) {
      if (error instanceof UnsupportedChainIdError) {
        setTimeout(() => activate(walletConnect), 500);
      } else {
        console.log('Pending Error Occured', error);
      }
    }
  };

  const connectMetamask = () => {
    activate(injected);
    setProvider("injected")
    onClose();
  };

  const isCasperConnected = () => {
    return window.casperlabsHelper.isConnected();
  };

  const setCasperProfile = async () => {
    setProvider("casper");
    onClose();
    const publicKey = await Signer.getActivePublicKey();
    const walletProfile = {
      accountWallet: publicKey,
      chainId: 9999,
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
          toast({
            position: 'top-right',
            render: ({ onClose }) => <Alert message="Successfully Updated" onClose={onClose} />
          });
        })
        .catch((err) => {
          const message = err.msg || 'Something went wrong';
          toast({
            position: 'top-right',
            render: ({ onClose }) => <Alert message={message} color="red" onClose={onClose} />
          });
        });
    }
  };

  const connectCasper = async () => {
    const isConnected: boolean = await isCasperConnected();
    if (!isConnected) {
      Signer.sendConnectionRequest();
      const isConnectedNow: boolean = await isCasperConnected();
      if (isConnectedNow) {
        setCasperProfile();
      }
    } else {
      setCasperProfile();
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
    <div className="add-card-modal-wrapper">
          <div className="add-card-modal">
          <IconButton icon="remove" onClick={onClose} />
          <p className="text-heading3 text--lime text--center modal-title">Connect your wallet</p>
          <SimpleGrid spacingY="10px">
            <IconButton
              icon="metamask"
              text="METAMASK"
              onClick={connectMetamask}
              fullWidth
              fontWeight={600}
              backgroundColor="white"
              justifyContent="flex-start"
              paddingX="12px"
            />
            <IconButton
              icon="walletConnect"
              text="WALLETCONNECT"
              onClick={connectWalletConnect}
              fullWidth
              fontWeight={600}
              backgroundColor="white"
              justifyContent="flex-start"
              paddingX="12px"

            />
            <IconButton
              icon="casper-coin"
              text="CASPER"
              onClick={connectCasper}
              fullWidth
              fontWeight={600}
              backgroundColor="white"
              justifyContent="flex-start"
              paddingX="12px"
            />
            <Box mb={5}>
             <p>By connecting your wallet, you agree to our <Link className="text-heading6 text--start text--lime " to={termsOfService}>Terms of Service</Link>,{' '}
            <Link className="text-heading6 text--start text--lime " to={privacyPolicy}>Privacy Policy</Link> and our <Link className="text-heading6 text--start text--lime " to={codeOfProduct}>Code of conduct</Link>.</p>
            </Box>
            <p>New to wallets?</p>
            <p  >Read the&nbsp;<Link className="text-heading6 text--start text--lime " to={METAMASK_FAQS_URL}>Get started guide.</Link></p>
          </SimpleGrid>
          </div>
      </div>

    </Modal>
  );
};

export default ConnectWalletModal;
