import { Button, Input } from '@chakra-ui/core';
import classnames from 'classnames';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { PaymentApi, TransactionApi, WalletApi } from '../../../apis';
import { AnimationOnScroll, IHeadCell, Icon, RecordModal, Select, Selectable, Table } from '../../../components';
import { ROUTES } from '../../../constants';
import { getUser } from '../../../store/selectors';
import './styles.scss';

const options = [
  {
    label: 'ETHEREUM (ETH)',
    value: 'ETH'
  },
  {
    label: 'CASPER (CSPR)',
    value: 'CSPR'
  }
];

const headCells: IHeadCell[] = [
  {
    label: 'Time',
    key: 'createdAt',
    render: (row) => moment(row.createdAt).calendar()
  },
  {
    label: 'coin',
    key: 'currency'
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
    label: 'From',
    key: 'from',
    render: (row) => (row.from ? `${row.from.slice(0, 8)}...${row.from.slice(-8)}` : '_')
  },
  {
    label: 'To',
    key: 'to',
    render: (row) => (row.to ? `${row.to.slice(0, 8)}...${row.to.slice(-8)}` : '_')
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

export const WithdrawPage: FC = () => {
  const [coin, setCoin] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number | any>('');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAll, setIsAll] = useState<boolean>(true);
  const [visibleRecordModal, setVisibleRecordModal] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tableData, setTableData] = useState([]);
  const [pageLimit, setPageLimit] = useState<number>(5);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [casperWallets, setCasperWallets] = useState<any>([]);
  const [ethWallets, setEthWallets] = useState<any>([]);



  const user = useSelector(getUser);

  const history = useHistory();

  const { pathname, search } = useLocation();

  const activeCoinFees = useMemo(() => {
    let fees = 0;
    if (coin === 'CSPR') {
      fees = 2.5;
    }
    return [
      {
        name: 'Withdrawal Fee',
        amount: fees
      },
      {
        name: 'Deduction:',
        amount: +amount + +fees
      }
    ];
  }, [amount, coin]);

  const fetchTransactions = useCallback(() => {
    TransactionApi.gettransactions({
      query: {
        userId: user?.id,
        type: 'Withdrawal',
        currency: coin
      },
      options: {
        skip: (currentPage - 1) * pageLimit,
        limit: pageLimit
      }
    })
      .then((res) => {
        setTableData(res.transactions);
        setTotalPage(Math.ceil(res.pagination.total / pageLimit));
      })
      .catch((err) => {
        setTableData([]);
        console.log(err);
      });
  }, [coin, user, currentPage, pageLimit]);

  const handleCoinChange = (value: string) => {
    setCoin(value);
    history.push(`${pathname}?coin=${value}`);
  };

  const handleWithdraw = () => {
    setIsLoading(true)
    if (coin === 'CSPR' && amount < 2.5) {
      setIsLoading(false)
      return alert('Minimum amount of casper to send is 2.5 CSPR');
    }
    if (coin && address && amount) {
      setIsLoading(false)
      setVisibleModal(true);
    }
  };

  const handleClose = () => {
    setVisibleModal(false);
  };

  const handleConfirm = async () => {
    setIsLoading(true)
    if (coin && address && amount) {
      await PaymentApi.generateWithdrawal({
        options: {
          id: user?.id,
          currency: coin,
          address,
          amount,
          from: selectedWallet
        }
      });
      setIsWithdraw(true);
      setIsLoading(false)
    }
  };

  const handleGoToHome = () => {
    history.push(ROUTES.HOME);
  };

  const handleToggleAll = () => {
    setIsAll(!isAll);
  };

  const handleRefresh = () => {
    fetchTransactions();
  };

  const handleShowAllRecords = () => {
    setPageLimit(10);
    setVisibleRecordModal(true);
  };

  const changeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.currentTarget.value);
  };

  const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value);
  };

  const handleCloseRecordModal = () => {
    setPageLimit(5);
    setVisibleRecordModal(false);
  };

  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (coin) {
      fetchTransactions();
    }
  }, [currentPage, pageLimit, coin, fetchTransactions]);


  const handleWalletChange = (value: string) => {
    setSelectedWallet(value);
  };

  useEffect(() => {
    const coin = new URLSearchParams(search).get('coin');
    const isValidCoin = options.find((o) => o.value === coin);
    if (coin && isValidCoin) {
      setCoin(coin);
    }
  }, [search]);

  useEffect(() => {
    WalletApi.readAll()
      .then((res) => {
        const casperWallets: any = [];
        const ethereumWallets: any = [];
        res.wallets?.forEach((wallet: any) => {
          if (wallet.chain === 'CSPR') {
            casperWallets.push({ label: wallet.name, value: wallet.address, chain: wallet.chain });
          } else if (wallet.chain === 'ETH') {
            ethereumWallets.push({ label: wallet.name, value: wallet.address, chain: wallet.chain });
          }
        });
        setCasperWallets(casperWallets);
        setEthWallets(ethereumWallets);
      })
      .catch((err) => {
        console.log('🚀 ~ file: index.tsx:329 ~ useEffect ~ err:', err);
      });
  }, []);

  useEffect(() => {
    if (coin === 'CSPR' && casperWallets.length > 0) {
      const defaultWallet = casperWallets.find((wallet: any) => wallet.chain === 'CSPR');
      setSelectedWallet(defaultWallet.value);
    } else if (coin === 'ETH' && ethWallets.length > 0) {
      const defaultWallet = ethWallets.find((wallet: any) => wallet.chain === 'ETH');
      setSelectedWallet(defaultWallet.value);
    }
  }, [ethWallets, casperWallets, coin]);

  return (
    <div className="withdraw-page">
      <AnimationOnScroll animation="animate__bounce" delay={2}>
        <div className="page-title">
          <h2 className="text-heading2">Withdraw.</h2>
        </div>
      </AnimationOnScroll>
      <div className="content">
        <div className="withdraw-content">
          {/* <AnimationOnScroll animation="animate__fadeIn" delay={1.5}> */}
          <div className="withdraw-item">
            <div className="withdraw-step">
              <span className="text-body1">1</span>
              {coin !== 'CSPR' && (
                <>
                  <div className="step-divider" />
                  <span className="text-body1">2</span>{' '}
                </>
              )}
            </div>
            <div className="wrapper">
              <p className="text-heading4 label">Select Coin</p>
              <Select options={options} value={coin} onChange={handleCoinChange} />
              <p className="text-heading4 label">Select wallet</p>
              <Select
                options={coin === 'CSPR' ? casperWallets : ethWallets}
                value={selectedWallet}
                placeholder="Default"
                onChange={handleWalletChange}
              />
              {coin !== 'CSPR' && (
                <>
                  <p className="text-heading4 label">Select public chain</p>
                  <div className="public-cards">
                    <Selectable name="TRC20" value="TRON" fees={0.79} />
                    <Selectable name="ERC20" value="Ethereum / ERC-20" fees={4.2} />
                  </div>
                  <p className="text-body2 text--lime description">Deposit restrictions and limits</p>
                </>
              )}
            </div>
          </div>
          {/* </AnimationOnScroll> */}
          <AnimationOnScroll animation="animate__fadeIn" delay={1.5}>
            <div className="withdraw-item">
              <div className="wrapper">
                <p className="text-heading4 label">Withdrawal Address</p>
                <Input className="d-form-input address-input" value={address} onChange={changeAddress} />
                <p className="text-heading4 label">Amount</p>
                <Input
                  className="d-form-input address-input"
                  type={'tel'}
                  placeholder={'0'}
                  value={amount}
                  isDisabled={isLoading}
                  onChange={changeAmount}
                />
                <p className="text-heading4 label">Receive Amount</p>
                <div className="amount-input-wrapper">
                  <div className="amount-input">
                    <span className="text-heading4 text--lime">{amount}</span>
                    <div className="amount-input-action">
                      <span className="text-body2">{coin}</span>
                      <div className="amount-input-action-divider" />
                      <span
                        className={classnames('text-body2 toggle-all', {
                          'text--lime': isAll
                        })}
                        onClick={handleToggleAll}
                      >
                        All
                      </span>
                    </div>
                  </div>
                  <div className="amount-fees">
                    {activeCoinFees.map(({ name, amount }, index) => {
                      return (
                        <div key={index} className="amount-fee">
                          <span className="text-body2">{name}</span>
                          <div>
                            <span className="text-body2">{amount}</span>
                            <span className="text-body2 fee-unit">{coin}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Button
                  className="d-button d-button--full-width"
                  leftIcon={() => <Icon name="withdraw" />}
                  isDisabled={isLoading}
                  onClick={handleWithdraw}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </AnimationOnScroll>
        </div>
        <AnimationOnScroll animation="animate__fadeIn" isSubElement>
          <Table data={tableData} headCells={headCells} onRefresh={handleRefresh} onShowAll={handleShowAllRecords} />
        </AnimationOnScroll>
        <RecordModal open={visibleRecordModal} title="Withdraw Records" onClose={handleCloseRecordModal}>
          <Table
            data={tableData}
            headCells={headCells}
            totalPage={totalPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </RecordModal>
        {visibleModal && (
          <div className="modal-wrapper">
            <div className="modal">
              {!isWithdraw ? (
                <div className="confirm-content">
                  <p className="text-heading3">Do you confirm this Withdrawal?</p>
                  <p className="text-heading3">
                    Total:{' '}
                    <span className="text--lime">
                      {amount} {coin}
                    </span>
                  </p>
                  <div className="modal-action">
                    <Button className="d-button" isDisabled={isLoading} onClick={handleClose}>
                      NO
                    </Button>
                    <Button className="d-button" isDisabled={isLoading} onClick={handleConfirm}>
                      YES
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="done-content">
                  <p className="text-heading3 text--lime modal-title">Done!</p>
                  <p className="text-body1 text--center modal-description">
                    You can check the status of your transaction in the withdraw records.
                  </p>
                  <Button className="d-button" isDisabled={isLoading} onClick={handleGoToHome}>
                    Back to Home
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
