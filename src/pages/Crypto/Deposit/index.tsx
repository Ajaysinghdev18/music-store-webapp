import { Button, Input, useToast } from '@chakra-ui/core';
import { Web3Provider } from '@ethersproject/providers';
import { CLPublicKey, DeployUtil } from 'casper-js-sdk';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Web3 from 'web3';

import { PaymentApi, TransactionApi, WalletApi } from '../../../apis';
import { getCasperBalance } from '../../../apis/balance.api';
import { deployWalletTransaction } from '../../../apis/transaction.api';
import { Alert, AnimationOnScroll, IHeadCell, Icon, RecordModal, Select, Selectable, Table } from '../../../components';
import { getUser } from '../../../store/selectors';
import { copyTextToClipboard, makeNativeTransferDeploy } from '../../../utils';
import { useWalletService } from '../../../utils/wallet-service';
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

const ethDepositOptions = [
  {
    label: 'Wallet',
    value: 'wallet'
  },
  {
    label: 'Other',
    value: 'coinpayments'
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

// const casperTransactionCharges: number = 2.5;

export const DepositPage: FC = () => {
  const [coin, setCoin] = useState<string>('');
  const [ethDepositType, setEthDepositType] = useState<string>('');
  const [isGeneratingAddress, setIsGeneratingAddress] = useState<boolean>(false);
  const [generatedAddress, setGeneratedAddress] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string>('');
  const [isAddressCopied, setIsAddressCopied] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState<string | null>(null);
  const [visibleRecordModal, setVisibleRecordModal] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tableData, setTableData] = useState([]);
  const [pageLimit, setPageLimit] = useState<number>(5);
  const [casperWallets, setCasperWallets] = useState<any>([]);
  const [ethActivePublicKey, setEthActivePublicKey] = useState<any>([]);
  const [ethWallets, setEthWallets] = useState<any>([]);
  const [isWalletTransactionDone, setIsWalletTransactionDone] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [vissibleWalletModal, setVisibleWalletModal] = useState<boolean>(false);
  const [amountToBeSend, setAmountToBeSend] = useState<number>(0);
  const [walletTransactionHash, setWalletTransactionHash] = useState<string>('');
  const [csprCopiedHash, setCsprCoipedHash] = useState<boolean>(false);
  const [casperAccountBalance, setCasperAccountBalance] = useState<number>(0);
  const [casperBalanceAfterDeduction, setCasperBalanceAfterDeduction] = useState<number>(0);
  const coinRef = useRef<string>('');
  const isCsprWalletConnectedRef = useRef<boolean>(false);
  const [isNext, setNext] = useState<boolean>(false);
  const toast = useToast();
  const casperDecimals = 1000000000;

  if (casperBalanceAfterDeduction) {
    // Add your code
  }

  const { activePublicKey: casperActivePublicKey, connect, disconnect, sign } = useWalletService();

  const user = useSelector(getUser);

  const { search } = useLocation();

  const fetchTransactions = useCallback(() => {
    TransactionApi.gettransactions({
      query: {
        userId: user?.id,
        type: 'Deposit',
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
  }, [coin, currentPage, pageLimit, user]);

  const handleCoinChange = (value: string) => {
    coinRef.current = value;
    setCoin(value);
  };

  const handleEthDepositType = (value: string) => {
    setEthDepositType(value);
  };

  const handleWalletChange = (value: string) => {
    setSelectedWallet(value);
  };

  const AccountInformation = useCallback(async (publicKey: string) => {
    try {
      if (casperActivePublicKey) {
        const response = await getCasperBalance(publicKey);
        setCasperAccountBalance(+(response.balance / casperDecimals).toFixed(4));
      }
    } catch (error) {
      // console.log('🚀 ~ file: index.tsx ~ line 164 ~ AccountInformation ~ error', error);
    }
  }, [casperActivePublicKey]);

  if (casperAccountBalance) {
    // fix me
  }

  const handleGenerate = async () => {
    if (coin) {
      setIsGeneratingAddress(true);
      const { address } = await PaymentApi.getDepositAddress({
        options: {
          id: user?.id,
          currency: coin
        }
      });
      setGeneratedAddress(address);
      setIsGeneratingAddress(false);
    }
  };

  const handleRefresh = () => {
    fetchTransactions();
  };

  const handleShowAllRecords = () => {
    setPageLimit(10);
    setVisibleRecordModal(true);
  };

  const copyAddress = (address: string, type = '') => {
    if (type === 'CSPR_TRANSACTION_HASH') {
      setCsprCoipedHash(true);
      copyTextToClipboard(address);
    } else {
      setIsAddressCopied(address);
      copyTextToClipboard(address);
    }
  };

  const resetCopyState = useCallback(() => {
    if (isAddressCopied || csprCopiedHash) {
      setTimeout(() => {
        setIsAddressCopied(null);
        setCsprCoipedHash(false);
      }, 1500);
    }
  }, [csprCopiedHash, isAddressCopied]);

  // Close record modal handler
  const handleCloseRecordModal = () => {
    setPageLimit(5);
    setVisibleRecordModal(false);
  };
  // Close wallet modal handler
  const handleCloseWalletModal = () => {
    setVisibleWalletModal(false);
  };

  const nextStepHandler = async () => {
    try {
      if (coin === 'CSPR') {
        if (isNext) {
          setLoading(true);
          const transferId = Math.floor(Math.random() * 9000 + 1000).toString();
          const amount = parseFloat((amountToBeSend * casperDecimals).toString());
          const deploy = makeNativeTransferDeploy(
            casperActivePublicKey as string,
            selectedWallet,
            amount.toString(),
            transferId
          );
          await handleSignDeploy(casperActivePublicKey as string, deploy);
          return;
        }
        setNext(true);
      } else if (coin === 'ETH') {
        await handleSend();
      }
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:254 ~ nextStepHandler ~ error:', error);
      setLoading(false);
    }
  };

  const makeAnotherTransferHandler = () => {
    setWalletTransactionHash('');
    setCsprCoipedHash(false);
    setIsWalletTransactionDone(false);
    setAmountToBeSend(2.5);
  };

  // Page change handler
  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  // Amount Change handler
  const amountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.currentTarget.value;
    setAmountToBeSend(value);
  };

  // On current page changed
  useEffect(() => {
    if (user) {
      if (coin) {
        fetchTransactions();
      }
      if (coin === 'ETH') {
        setEthDepositType('wallet');
      }
    }
  }, [currentPage, pageLimit, coin, walletTransactionHash, user, fetchTransactions]);

  useEffect(() => {
    resetCopyState();
  }, [isAddressCopied, csprCopiedHash, resetCopyState]);

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
  const checkEthActivePublicKey = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      console.log('🚀 ~ file: index.tsx:396 ~ checkEthActivePublicKey ~ accounts:', accounts);
      setEthActivePublicKey(accounts);
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:395 ~ checkEthActivePublicKey ~ error:', error);
    }
  };

  useEffect(() => {
    checkEthActivePublicKey();
    const currentCoin = new URLSearchParams(search).get('coin');
    const isValidCoin = options.find((o) => o.value === currentCoin);
    if (currentCoin && isValidCoin) {
      coinRef.current = currentCoin;
      setCoin(currentCoin);
    }
  }, [search]);

  useEffect(() => {
    if (coin === 'CSPR' && casperWallets.length > 0) {
      const defaultWallet = casperWallets.find((wallet: any) => wallet.chain === 'CSPR');
      setSelectedWallet(defaultWallet.value);
    } else if (coin === 'ETH' && ethWallets.length > 0) {
      const defaultWallet = ethWallets.find((wallet: any) => wallet.chain === 'ETH');
      setSelectedWallet(defaultWallet.value);
    }
  }, [ethWallets, casperWallets, coin]);

  //Connect Wallet
  const connectCasperWalletHandler = async () => {
    try {
      const connection = await connect();
      if (!connection) {
        setVisibleWalletModal(true);
      }
    } catch (error) {
      console.log('🚀 ~ file: index.tsx ~ line 209 ~ connectCasperWalletHandler ~ error', error);
    }
  };

  useEffect(() => {
    if (casperActivePublicKey) {
      AccountInformation(casperActivePublicKey as string);
      setConnectedWalletAddress(casperActivePublicKey as string);
    }
  }, [casperActivePublicKey, AccountInformation]);
  const disconnectWalletHandler = async () => {
    isCsprWalletConnectedRef.current = false;
    try {
      if (coin === 'CSPR') {
        disconnect();
      }
    } catch (error) {
      console.log('🚀 ~ file: index.tsx ~ line 209 ~ connectWalletHandler ~ error', error);
    }
  };

  // For native-transfers the payment price is fixed.
  const paymentAmount = 0.1; //CSPR
  // get amount to send from input.

  const handleSignDeploy = (accountPublicKey: string, deploy: DeployUtil.Deploy) => {
    if (accountPublicKey) {
      const deployJson: any = DeployUtil.deployToJson(deploy);
      sign(JSON.stringify(deployJson), accountPublicKey)
        .then(async (res: any) => {
          if (res.cancelled) {
            toast({
              position: 'top-right',
              render: ({ onClose }) => <Alert message="Transaction cancelled!" color="red" onClose={onClose} />
            });
            setLoading(false);
          } else {
            setLoading(true);
            const signedDeploy: any = DeployUtil.setSignature(
              deploy,
              res.signature,
              CLPublicKey.fromHex(accountPublicKey)
            );
            const deployJson: any = DeployUtil.deployToJson(signedDeploy);
            const transaction = await deployWalletTransaction({
              value: deployJson,
              amount: amountToBeSend,
              to: selectedWallet,
              from: connectedWalletAddress,
              coin,
              tx: ''
            });
            setWalletTransactionHash(transaction.deployHash);
            setIsWalletTransactionDone(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log('🚀 ~ file: index.tsx:467 ~ err:', err);
          setLoading(false);
          throw err;
        });
    }
  };

  const connectMetamaskHandler = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this feature');
        return;
      }

      // Connect to the Ethereum network using MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setEthActivePublicKey(accounts);
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:431 ~ handleSend ~ error:', error);
    }
  };


  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleSend = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this feature');
        return;
      }

      if (!window.ethereum) throw new Error('No crypto wallet found. Please install it.');
      const provider = new Web3Provider(window.ethereum);
      const getDeploy = async (txHash: string) => {
        let i = 100;
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          while (i != 0) {
            const res = await provider.getTransactionReceipt(txHash)
            if (res?.status == 1) {
              resolve(res);
              break;

            } else {
              i--;
              await sleep(2000);
              continue;
            }
          }
          reject('Request timeout [getDeploy]')
        })
      };
      const signer = provider.getSigner();
      // Build the transaction object
      const ethValue = Web3.utils.toWei(amountToBeSend.toString(), 'ether');

      const transaction = {
        to: selectedWallet,
        value: ethValue
      };

      setLoading(true);

      // Send the transaction
      const tx = await signer.sendTransaction(transaction);
      getDeploy(tx.hash).then(async (res) => {
        await deployWalletTransaction({
          value: null,
          amount: amountToBeSend,
          to: selectedWallet,
          from: ethActivePublicKey[0],
          coin,
          tx: tx.hash
        });
        setLoading(false);
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message="Transaction completed!" color="lime" onClose={onClose} />
        });
        setWalletTransactionHash(tx.hash);
        setIsWalletTransactionDone(true);
      })
        .catch((errr) => {
          console.log("🚀 ~ file: index.tsx:480 ~ handleSend ~ errr:", errr)
          toast({
            position: 'top-right',
            render: ({ onClose }) => <Alert message="Transaction rejected!" color="red" onClose={onClose} />
          });
        })

    } catch (error: any) {
      console.log('🚀 ~ file: index.tsx:441 ~ handleSend ~ error:', error.code);
      setLoading(false);
      if (error.code === 'INSUFFICIENT_FUNDS') {
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message="Insufficient funds in wallet!" color="red" onClose={onClose} />
        });
      } else if (error.code === 'ACTION_REJECTED') {
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message="Transaction rejected!" color="red" onClose={onClose} />
        });
      }
    }

  };

  // Return deposit page
  return (
    <div className="deposit-page">
      <AnimationOnScroll animation="animate__bounce" delay={2}>
        <div className="page-title">
          <h2 className="text-heading2">Deposit.</h2>
        </div>
      </AnimationOnScroll>
      <div className="content">
        <div className="deposit-content">
          <AnimationOnScroll animation="animate__fadeIn" delay={1}>
            <div className="deposit-item">
              <div className="deposit-step">
                <span className="text-body1">1</span>
                <div className="step-divider" />
                <span className="text-body1">2</span>
                {isWalletTransactionDone && (
                  <>
                    <div className="step-divider-done" />
                    <span className="text-body1">3</span>
                  </>
                )}
              </div>
              <div className="wrapper">
                <p className="text-heading4 label">Select coin</p>
                <Select options={options} value={coin} onChange={handleCoinChange} />
                {coin === 'ETH' && (
                  <>
                    {' '}
                    <p className="text-heading4 label">Deposit Type</p>{' '}
                    <Select options={ethDepositOptions} value={ethDepositType} onChange={handleEthDepositType} />
                  </>
                )}
                {(coin === 'CSPR' && !casperActivePublicKey) ||
                  (coin === 'ETH' && ethActivePublicKey.length <= 0 && ethDepositType === 'wallet') ? (
                  <Button
                  isDisabled={isLoading}
                    className="d-button d-button--full-width"
                    onClick={coin === 'ETH' ? connectMetamaskHandler : connectCasperWalletHandler}
                  >
                    Connect Wallet
                  </Button>
                ) : ethDepositType === 'wallet' || coin === 'CSPR' ? (
                  <>
                    <p className="text-heading4 label">Select wallet</p>
                    <Select
                      options={coin === 'CSPR' ? casperWallets : ethWallets}
                      value={selectedWallet}
                      placeholder="Default"
                      onChange={handleWalletChange}
                    />
                    {coin === 'CSPR' && <p className="text-heading4 label">Balance: {casperAccountBalance} CSPR</p>}
                    <p className="text-heading4 label">Transaction Details</p>
                    <div className="d-form-field">
                      <Input
                        className="d-form-input address-input"
                        isDisabled={isLoading}
                        value={coin === 'CSPR' ? connectedWalletAddress : ethActivePublicKey[0]}
                      />
                      <span className="copy-address" onClick={() => copyAddress(connectedWalletAddress, 'TRX')}>
                        {isAddressCopied === connectedWalletAddress || ethActivePublicKey[0] ? (
                          <span className="text--lime copy">COPIED</span>
                        ) : (
                          <Icon name="copy" />
                        )}
                      </span>
                    </div>
                    {coin === 'CSPR' && isNext && (
                      <>
                        <p className="text-heading4 label">
                          You'll send: {parseFloat(amountToBeSend.toString()).toFixed(5)} {coin}
                        </p>
                        <p className="text-heading4 label">
                          Transaction fee: {(paymentAmount * casperDecimals) / casperDecimals} {coin}
                        </p>
                        <p className="text-heading4 label">
                          Total: {(amountToBeSend + paymentAmount).toFixed(5)} {coin}
                        </p>
                      </>
                    )}
                    {!isWalletTransactionDone ? (
                      <div className="d-form-field">
                        {' '}
                        <input
                          className="d-form-input address-input"
                          min={0}
                          disabled={isLoading}
                          value={amountToBeSend}
                          step="any"
                          type="number"
                          onChange={amountHandler}
                        />{' '}
                      </div>
                    ) : (
                      <div className="transaction-done">
                        <p className="text-heading4 label">Deploy hash</p>
                        <div className="d-form-field">
                          <Input className="d-form-input address-input" isDisabled={isLoading} value={walletTransactionHash} />
                          <span
                            className="copy-address"
                            onClick={() => copyAddress(walletTransactionHash, 'CSPR_TRANSACTION_HASH')}
                          >
                            {csprCopiedHash ? <span className="text--lime copy">COPIED</span> : <Icon name="copy" />}
                          </span>
                        </div>
                        <p className="text-heading4 sent">Sucessfully sent!</p>
                      </div>
                    )}
                    {!isWalletTransactionDone ? (
                      <Button
                        className="d-button d-button--full-width"
                        isLoading={isLoading}
                        onClick={nextStepHandler}
                        isDisabled={false}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        className="d-button d-button--full-width"
                        onClick={makeAnotherTransferHandler}
                        isDisabled={false}
                      >
                        Make another transfer
                      </Button>
                    )}
                    {coin === 'CSPR' && (
                      <Button className="d-button d-button--full-width" onClick={disconnectWalletHandler}>
                        Disconnect
                      </Button>
                    )}
                  </>
                ) : (
                  ''
                )}
                {ethDepositType === 'coinpayments' && coin === 'ETH' && (
                  <>
                    <p className="text-heading4 label">Select public chain</p>
                    <div className="public-cards">
                      <Selectable name="TRC20" value="TRON" fees={0.79} />
                      <Selectable name="ERC20" value="Ethereum / ERC-20" fees={4.2} />
                    </div>
                    <Button
                      className="d-button d-button--full-width"
                      leftIcon={() => <Icon name="settings" />}
                      onClick={handleGenerate}
                    >
                      Generate {generatedAddress ? 'New' : ''} Address
                    </Button>
                    <p className="text-body2 text--lime description">Deposit restrictions and limits</p>
                  </>
                )}
              </div>
            </div>
          </AnimationOnScroll>
          <div className="deposit-details">
            {generatedAddress && !isGeneratingAddress && coin === 'ETH' && ethDepositType === 'coinpayments' && (
              <AnimationOnScroll animation="animate__fadeIn">
                <div className="deposit-item">
                  <div className="wrapper">
                    <p className="text-heading4 label">Deposit To:</p>
                    <span className="copy-address full" onClick={() => copyAddress(generatedAddress)}>
                      <span className="text-heading4 text--lime">{generatedAddress}</span>
                      {isAddressCopied === generatedAddress ? (
                        <span className="text--lime copy">COPIED</span>
                      ) : (
                        <Icon name="copy" />
                      )}
                    </span>
                    <p className="text-heading4 label">Or scan the QR code:</p>
                    <QRCode value={generatedAddress} bgColor="#000" fgColor="#fff" size={162} />
                  </div>
                </div>
              </AnimationOnScroll>
            )}
            {showQrCode && coin === 'ETH' && ethDepositType === 'coinpayments' && (
              <AnimationOnScroll animation="animate__fadeIn">
                <div className="deposit-item">
                  <div className="wrapper">
                    <p className="text-heading4 label">Or scan this QR code:</p>
                    <QRCode value={showQrCode} bgColor="#000" fgColor="#fff" size={162} />
                  </div>
                </div>
              </AnimationOnScroll>
            )}
          </div>
        </div>
        <AnimationOnScroll animation="animate__fadeIn">
          <Table data={tableData} headCells={headCells} onRefresh={handleRefresh} onShowAll={handleShowAllRecords} />
        </AnimationOnScroll>
        <RecordModal open={visibleRecordModal} title="Deposit Records" onClose={handleCloseRecordModal}>
          <Table
            data={tableData}
            headCells={headCells}
            totalPage={totalPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onRefresh={handleRefresh}
          />
        </RecordModal>
        <RecordModal open={vissibleWalletModal} title="Information!" onClose={handleCloseWalletModal}>
          <p>
            You don't have extension installed. Please install the extension through{' '}
            <a
              target={'_blank'}
              href="https://chrome.google.com/webstore/detail/casper-wallet/abkahkcbhngaebpcgfmhkoioedceoigp"
              rel="noopener noreferrer"
            >
              https://chrome.google.com/webstore/detail/casper-wallet/abkahkcbhngaebpcgfmhkoioedceoigp
            </a>
          </p>
        </RecordModal>
      </div>
    </div>
  );
};
