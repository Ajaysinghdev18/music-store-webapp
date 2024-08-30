// Dependencies
import { Box, Button, Flex } from '@chakra-ui/core';
// import * as Yup from 'yup';
import SumsubWebSdk from '@sumsub/websdk-react';
import classnames from 'classnames';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

// Apis
import { BalanceApi, TransactionApi, UserApi } from '../../../../apis';
// Component
import {
  AddCardModal,
  AnimationOnScroll,
  IHeadCell,
  Icon,
  IconButton,
  RecordModal,
  Table
} from '../../../../components';
// Constants
import { ROUTES } from '../../../../constants';
import { IBalance } from '../../../../shared/interfaces/balance.interface';
import { setBalances } from '../../../../store/actions';
// Store
import { getBalances, getUser } from '../../../../store/selectors';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../utils/generaltittlefunction';
// Styles
import './styles.scss';

interface ICard {
  cardNumber: string;
  name: string;
  country: string;
  postalCode: string;
}

const headCells: IHeadCell[] = [
  {
    label: 'Time',
    key: 'createdAt',
    render: (row) => moment(row.createdAt).calendar()
  },
  {
    label: 'Amount',
    align: 'right',
    key: 'amount',
    render: (row) => row.amount || 0
  },
  {
    label: 'Network',
    key: 'network'
  },
  {
    label: 'Deposit / Withdrawal Address',
    key: 'address',
    render: (row) => (row.address ? `${row.address.slice(0, 8)}...${row.address.slice(-8)}` : '_')
  },
  {
    label: 'Status',
    key: 'status'
  },
  {
    label: 'TXID',
    align: 'right',
    key: 'txKey',
    render: (row) => (row.txKey ? `${row.txKey.slice(0, 4)}...${row.txKey.slice(-4)}` : '_')
  }
];

// Validation schema
// const validationSchema = Yup.object().shape({
//   name: Yup.string().required('Name is required!'),
//   cardNumber: Yup.string().required('Card number is required!'),
//   postalCode: Yup.string().required('Postal code is required!'),
//   country: Yup.string().required('Country is required!')
// });

// Export payment-method tab
export const PaymentMethodsTab = () => {
  // States
  const [balance, setBalance] = useState<IBalance>();
  const [card, setCard] = useState<ICard>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleKycModal, setVisibleKycModal] = useState<boolean>(false);
  const [isKYC, setIsKYC] = useState<boolean>(false);
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>('');
  console.log('🚀 ~ file: index.tsx:97 ~ PaymentMethodsTab ~ accessToken:', accessToken);
  const [newBal, setNewBal] = useState<IBalance>();
  // const SUM_SUB_TOKEN = process.env.REACT_APP_SUMSUB_APP_TOKEN;
  // const SECRET_KEY = process.env.REACT_APP_SUMSUB_SECRET_KEY;
  const [visibleRecordModal, setVisibleRecordModal] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tableData, setTableData] = useState([]);
  const [pageLimit, setPageLimit] = useState<number>(5);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  // Get user from store
  const user = useSelector(getUser);

  // Dispatch initializer
  const dispatch = useDispatch();

  // Get balance from store
  const balances = useSelector(getBalances);
  // Fetch transactions
  const fetchTransactions = useCallback(() => {
    setIsRefetching(true);
    BalanceApi.getBalance({
      options: {
        id: user?.id
      }
    })
      .then((res) => {
        dispatch(setBalances(res.balance));
        TransactionApi.gettransactions({
          query: {
            userId: user?.id,
            currency: balance?.unit
          },
          options: {
            skip: (currentPage - 1) * pageLimit,
            limit: pageLimit
          }
        })
          .then((res) => {
            setTableData(res.transactions);
            setTotalPage(Math.ceil(res.pagination.total / pageLimit));
            setIsRefetching(false);
          })
          .catch((err) => {
            setTableData([]);
            console.log(err);
          })
          .finally(() => setIsRefetching(false));
      })
      .catch((err) => {
        dispatch(setBalances({}));
        console.log(err);
      });
  }, [balance, currentPage, dispatch, pageLimit, user]);

  useEffect(() => {
    if (user?.id) {
      UserApi.getApplicationStatus()
        .then((res) => {
          if (res.data.reviewResult.reviewAnswer === 'GREEN' && !user?.isKYCVerified) {
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

  // Get history from hook
  const history = useHistory();

  // Get toast from hook
  // const toast = useToast();

  // Go to deposit handler
  const handleGoToDeposit = () => {
    history.push(`${ROUTES.CRYPTO.DEPOSIT}?coin=${balance?.unit}`);
  };

  // Go to withdraw handler
  const handleGoToWithdraw = () => {
    history.push(`${ROUTES.CRYPTO.WITHDRAW}?coin=${balance?.unit}`);
  };

  // Table refresh handler
  const handleRefresh = () => {
    fetchTransactions();
  };

  // Show all records handler
  const handleShowAllRecords = () => {
    setPageLimit(10);
    setVisibleRecordModal(true);
  };

  // Add card handler
  const handleAddCard = () => {
    setVisibleModal(true);
  };

  // Close handler
  const handleClose = () => {
    setVisibleModal(false);
  };

  // Submit handler
  const handleSubmit = (values: ICard) => {
    setCard(values);
    setVisibleModal(false);
  };

  const handleSetup = () => {
    if (user?.isKYCVerified) {
      setBalance(newBal);
      setVisibleKycModal(false);
    } else {
      history.push(ROUTES.KYC.INDEX);
    }
  };

  // Close record modal handler
  const handleCloseRecordModal = () => {
    setPageLimit(5);
    setVisibleRecordModal(false);
  };

  // Page change handler
  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  // On current page changed
  useEffect(() => {
    if (balance?.unit) {
      fetchTransactions();
    }
  }, [balance]);

  useEffect(() => {
    if (balances.length > 0) {
      const currentCurrency = balances.find((currency) => currency.unit === balance?.unit);
      setBalance(currentCurrency);
    }
  }, [balances, balance]);

  TabTitle('Payment Methods - Digital Music Shopping Market Place');
  metaTagByTitle('Payment Methods - Digital Music Shopping Market Place');
  metaTagByDesc(
    'Music-Store is founded on values we all share and are ready to stand for. They bring us together well beyond our current products and technologies. They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  // Return payment-method tab
  console.log('window.innerWidth', window.innerWidth);
  return (
    <div>
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
        <div className="payment-methods-tab">
          <div className="tab-content">
            {balance === undefined ? (
              <div className="methods">
                <div className="card">
                  <AnimationOnScroll animation="animate__fadeIn" delay={1}>
                    <div>
                      <h3 className="text-heading4">Credit / Debit Cards</h3>
                      <div
                        className={classnames('card-detect', {
                          detected: !!card
                        })}
                      >
                        <Icon name="payment" />
                        <span className="text-body2">
                          {card ? `${card.cardNumber}-${card.name}-${card.country}` : 'No Cards detected!'}
                        </span>
                      </div>
                      <Flex alignItems="end" justifyContent="space-between">
                        <Button className="d-button" mr="20px" onClick={handleAddCard}>
                          Add Card
                        </Button>
                        <Box className="link" mb="11px">
                          <Link to="#" className="text-body2">
                            How we protect you from credit card fraud
                          </Link>
                        </Box>
                      </Flex>
                    </div>
                  </AnimationOnScroll>
                  <AnimationOnScroll animation="animate__fadeIn" delay={2}>
                    <div>
                      <h3 className="text-heading4">Marketplace Credit</h3>
                      <div className="backdrop-blur marketplace-credit">
                        <p className="text-body1">$ 4.20 Total (incl. pending)</p>
                        <hr />
                        <p className="text-body2">$ 0.69 Available for Withdrawal</p>
                        <Icon name="newspaper-sharp" />
                      </div>
                      <Flex alignItems="end" justifyContent="space-between">
                        <Button className="d-button" mr="29px">
                          Withdraw
                        </Button>
                        <Box className="link" mb="11px">
                          <Link to="#" className="text-body2">
                            Withdrawal restrictions and limits
                          </Link>
                        </Box>
                      </Flex>
                    </div>
                  </AnimationOnScroll>
                </div>
                <AnimationOnScroll animation="animate__fadeIn" delay={1} className="card">
                  <h3 className="text-heading4">Prepaid Crypto Balance</h3>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/*  @ts-ignore*/}
                  {window.innerWidth > 786 ? (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //  @ts-ignore
                    <PerfectScrollbar className="perfect-scrollbar">
                      <div className="prepaid-crypto-balance">
                        {balances.map((bal, index) => (
                          <Box key={index}>
                            <p className="text-body2">Prepaid {bal.name} Balance</p>
                            <Button
                              className="d-button"
                              onClick={() => handleSubSum(bal)}
                              // onClick={()=>setVisibleKycModal(true)}
                              // onClick={() => setBalance(bal)}
                            >
                              {user?.isKYCVerified ? `${bal.price} ${bal.unit}` : 'Setup'}
                            </Button>
                          </Box>
                        ))}
                      </div>
                    </PerfectScrollbar>
                  ) : (
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                      {balances.map((bal, index) => (
                        <Box
                          mt={23}
                          mb={15}
                          display={'flex'}
                          height={50}
                          flexDirection={'column'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          key={index}
                        >
                          <p className="text-body2">Prepaid {bal.name} Balance</p>
                          <Button className="d-button" onClick={() => handleSubSum(bal)}>
                            {user?.isKYCVerified ? `${bal.price} ${bal.unit}` : 'Setup'}
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </AnimationOnScroll>
              </div>
            ) : (
              <div className="balance-setup">
                <div className="setup-content">
                  <p className="text-heading4 balance-heading">
                    Prepaid {balance?.name}({balance?.unit}) Balance
                  </p>
                  <div className="balance-content">
                    <div className="balance-card">
                      <span className="text-heading3">
                        {balance?.price} {balance?.unit}
                      </span>
                      <Icon name="wave" />
                      <span className="text-heading3">
                        {balance?.currency} {balance?.toUsd}
                      </span>
                    </div>
                    <div className="setup-action">
                      <Button
                        className="d-button d-button--full-width setup-action-button"
                        leftIcon={() => <Icon name="deposit" />}
                        onClick={handleGoToDeposit}
                      >
                        Deposit
                      </Button>

                      <Button
                        className="d-outlined-button d-button--full-width setup-action-button"
                        leftIcon={() => <Icon name="withdraw" />}
                        onClick={handleGoToWithdraw}
                      >
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </div>
                <Box display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
                  <Table
                    data={tableData}
                    headCells={headCells}
                    isRefreshing={isRefetching}
                    onRefresh={handleRefresh}
                    onShowAll={handleShowAllRecords}
                  />
                  <RecordModal
                    open={visibleRecordModal}
                    title="Deposit / Withdraw Records"
                    onClose={handleCloseRecordModal}
                  >
                    <Table
                      data={tableData}
                      headCells={headCells}
                      totalPage={totalPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </RecordModal>
                </Box>
              </div>
            )}
          </div>
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
                        Music-Store NFT.
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
          <AddCardModal open={visibleModal} onClose={handleClose} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};
