// Dependencies
import { Button, Flex, Input, Spinner } from '@chakra-ui/core';
import SumsubWebSdk from '@sumsub/websdk-react';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Apis
import { BalanceApi, UserApi, WalletApi } from '../../../../../apis';
// Components
import { Icon, IconButton, Select, WalletCard } from '../../../../../components';
import { BalanceCard } from '../../../../../components/BalanceCard';
import { ROUTES } from '../../../../../constants';
// Interfaces
import { IWallet } from '../../../../../shared/interfaces';
import { IBalance } from '../../../../../shared/interfaces/balance.interface';
import { setBalances } from '../../../../../store/actions';
import { getBalances, getUser } from '../../../../../store/selectors';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../../utils/generaltittlefunction';
// Styles
import './styles.scss';

const supportedWalets = [
  { label: 'CSPR', value: 'CSPR' },
  { label: 'ETH', value: 'ETH' }
];

// Export wallet tab
export const WalletTab: FC = () => {
  // States
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [balance, setBalance] = useState<IBalance>();
  const [visibleKycModal, setVisibleKycModal] = useState<boolean>(false);
  const [visibleCreateWalletModal, setCreateWalletModal] = useState<boolean>(false);
  const [isKYC, setIsKYC] = useState<boolean>(false);
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('CSPR');
  const [newWalletName, setWalletName] = useState<string>('');
  const [newBal, setNewBal] = useState<IBalance>();

  const { t } = useTranslation();

  // Get user from store
  const user = useSelector(getUser);
  const history = useHistory();

  const balances = useSelector(getBalances);
  // Dispatch initializer
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [createWalletLoading, setCreateWalletLoading] = useState<boolean>(false);

  // wallet change handler
  const handleWalletChange = (value: string) => {
    setSelectedChain(value);
  };

  const handleSetup = () => {
    if (user?.isKYCVerified) {
      setBalance(newBal);
      setVisibleKycModal(false);
    } else {
      history.push(ROUTES.KYC.INDEX);
    }
  };

  const handleSubSum = (bal: any) => {
    UserApi.getApplicationStatus()
      .then(async (res) => {
        if (res.data.reviewResult.reviewAnswer === 'GREEN') {
          if (user?.id) {
            await UserApi.updateProfile(user?.id, {
              ...user,
              isKYCVerified: true
            });
            await BalanceApi.createBalance({
              options: {
                id: user?.id
              }
            });
          }
        }
      })
      .catch((e) => console.log('error', e));
    if (user?.isKYCVerified) {
      setBalance(bal);
    } else {
      setNewBal(bal);
      setVisibleKycModal(true);
    }
  };

  //handle create new wallet
  const handleCreateWallet = () => {
    if (!newWalletName) {
      return alert('Please add wallet name');
    }
    setCreateWalletLoading(true);
    WalletApi.createWallet(newWalletName, selectedChain)
      .then((res: any) => {
        console.log('🚀 ~ file: index.tsx:127 ~ .then ~ res:', res);
        setWallets([...wallets, res.newWallet]);
        setCreateWalletLoading(false);
        setCreateWalletModal(false);
        setWalletName('');
      })
      .catch((err) => {
        console.log('🚀 ~ file: index.tsx:130 ~ handleCreateWal ~ err:', err);
        setCreateWalletLoading(false);
        setCreateWalletModal(false);
        setWalletName('');
      });
  };

  // Fetch wallets
  const fetchWallets = useCallback(() => {
    setLoading(true);
    WalletApi.readAll()
      .then((res) => {
        setWallets(res.wallets);
        setLoading(false);
      })
      .catch((err) => {
        console.log('>>');
      })
      .finally(() => setLoading(false));
  }, []);

  // On mounted
  useEffect(() => {
    if (user?.id) {
      fetchWallets();
      setLoading(true);
      BalanceApi.getBalance({
        options: {
          id: user?.id
        }
      })
        .then((res: any) => {
          dispatch(setBalances(res.balance));
          setLoading(false);
        })
        .catch((err: any) => {
          dispatch(setBalances({}));
          setLoading(false);
          console.log(err);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      UserApi.getApplicationStatus()
        .then((res) => {
          if (res.data.reviewResult.reviewAnswer === 'GREEN') {
            if (user?.id) {
              UserApi.updateProfile(user?.id, { ...user, isKYCVerified: true })
                .then((res) => console.log(res))
                .catch((e) => console.log(e));
            }
          }
        })
        .catch((e) => console.log('error', e));
    }
  }, [user]);

  TabTitle('Wallet - Digital Music Shopping Market Place');
  metaTagByTitle('Wallet - Digital Music Shopping Market Place');
  metaTagByDesc(
    'Music-Store is founded on values we all share and are ready to stand for. They bring us together well beyond our current products and technologies. They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  // Return wallet tab
  return (
    <div className="wallet-page">
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height={200}>
          <Spinner color="#00Ff00" size="xl" />
        </Flex>
      ) : (
        <div className="wallets-tab">
          {isKYC ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {' '}
              <SumsubWebSdk
                accessToken={accessToken}
                expirationHandler={() => Promise.resolve(accessToken)}
                config={{
                  lang: 'ru-RU',
                  i18n: {
                    document: {
                      subTitles: {
                        IDENTITY: 'Upload a document that proves your identity'
                      }
                    }
                  },
                  uiConf: {
                    customCssStr:
                      ':root {\n  --black: #000000;\n   --grey: #F5F5F5;\n  --grey-darker: #B2B2B2;\n  --border-color: #DBDBDB;\n}\n\np {\n  color: var(--black);\n  font-size: 16px;\n  line-height: 24px;\n}\n\nsection {\n  margin: 40px auto;\n}\n\ninput {\n  color: var(--black);\n  font-weight: 600;\n  outline: none;\n}\n\nsection.content {\n  background-color: var(--grey);\n  color: var(--black);\n  padding: 40px 40px 16px;\n  box-shadow: none;\n  border-radius: 6px;\n}\n\nbutton.submit,\nbutton.back {\n  text-transform: capitalize;\n  border-radius: 6px;\n  height: 48px;\n  padding: 0 30px;\n  font-size: 16px;\n  background-image: none !important;\n  transform: none !important;\n  box-shadow: none !important;\n  transition: all 0.2s linear;\n}\n\nbutton.submit {\n  min-width: 132px;\n  background: none;\n  background-color: var(--black);\n}\n\n.round-icon {\n  background-color: var(--black) !important;\n  background-image: none !important;\n}'
                  }
                }}
                options={{ addViewportTag: false, adaptIframeHeight: true }}
                onMessage={(type: any, payload: any) => {
                  if (type === 'idCheck.onApplicantLoaded') {
                    if (user?.id) {
                      UserApi.updateProfile(user?.id, {
                        ...user,
                        applicationId: payload.applicantId
                      })
                        .then((res) => console.log(res))
                        .catch((e) => console.log(e));
                    }
                  }
                  if (type === 'idCheck.applicantStatus') {
                    if (payload?.reviewResult?.reviewAnswer === 'GREEN') {
                      setIsContinue(true);
                      if (user?.id) {
                        UserApi.updateProfile(user?.id, {
                          ...user,
                          isKYCVerified: true
                        })
                          .then((res) => console.log(res))
                          .catch((e) => console.log(e));
                      }
                    }
                  }
                }}
                onError={(data: any) => console.log('onError', data)}
              />
              <div style={{ alignSelf: 'center' }}>
                {isContinue && (
                  <Button className="d-button" onClick={() => setIsKYC(false)}>
                    Continue
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="wallets-section">
                <h2 className="section-title text-heading3">{t('Profile.Wallet')}</h2>
                <div className="cards-container">
                  {wallets.map((wallet: IWallet, index) => (
                    <WalletCard key={wallet._id} wallet={wallet} isDefault={wallet.default} />
                  ))}
                  <WalletCard
                    setCreateWalletModal={setCreateWalletModal}
                    visibleCreateWalletModal={visibleCreateWalletModal}
                  />
                </div>
              </div>
              <div className="total-balance-section">
                <h2 className="section-title text-heading3">{t('Wallet.Total Balance')}</h2>
                <div className="cards-container">
                  {balances.map((balance: any, index) => (
                    <BalanceCard
                      key={index}
                      balance={balance}
                      isTest={true}
                      // isTest={index === balances.length - 1}
                      handleSubSum={handleSubSum}
                      // hasSetup={index !== 0}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {visibleKycModal && (
        <div className="modal-wrapper">
          <div className="modal modal-background">
            <IconButton icon="remove" onClick={() => setVisibleKycModal(false)} />
            <div className="modal-content-wrapper">
              <p className="text-heading3 text--lime text--center modal-title">Prepay {newBal?.name}</p>
              <div className="icon-container bottom">
                <Icon name={newBal?.icon || 'crypto'} />
              </div>
              <p className="text-heading4 text--center bottom">Attention!</p>
              <ul className="descriptions">
                <li className="bottom">
                  <p className="text-heading5 ">
                    Paying with ETH from your Prepaid {newBal?.unit} Balance is an instantaneous way to buy a
                    Music-Store Digital Asset.
                  </p>
                </li>
                <li className="bottom">
                  <p className="text-heading5 ">
                    However, adding to your Prepaid {newBal?.unit} Balance may take a few minutes
                  </p>
                </li>
                <li className="bottom">
                  <p className="text-heading5 ">
                    If this is your first time, you may be required to go through a short identity verification.
                  </p>
                </li>
              </ul>
              <Button className="d-button" onClick={() => handleSetup()}>
                Set Up Prepaid {newBal?.unit} Balance
              </Button>
              <p
                className="text-heading6 text--center text--lime "
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: 5,
                  lineHeight: 2
                }}
                onClick={() => setVisibleKycModal(false)}
              >
                Go Back
              </p>
            </div>
          </div>
        </div>
      )}
      {visibleCreateWalletModal && (
        <div className="wallet-modal-wrapper">
          <div className="modal modal-background">
            <IconButton icon="remove" onClick={() => setCreateWalletModal(false)} />
            <div className="modal-content-wrapper">
              <p className="text-heading3 text--lime text--center modal-title">Create New Wallet</p>
              <p className="text-heading4 label">Wallet Name</p>
              <Input
                className="d-form-input address-input"
                value={newWalletName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWalletName(e.currentTarget.value)}
              />
              <Select
                options={supportedWalets}
                value={selectedChain}
                placeholder="CSPR"
                onChange={handleWalletChange}
              />
              <Button className="d-button" onClick={handleCreateWallet} isLoading={createWalletLoading}>
                Create
              </Button>
              <p
                className="text-heading6 text--center text--lime "
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: 5,
                  lineHeight: 2
                }}
                onClick={() => setCreateWalletModal(false)}
              >
                Go Back
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
