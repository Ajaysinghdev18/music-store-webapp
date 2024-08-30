// Dependencies
import React, { FC, useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { useParams } from 'react-router-dom';
import { Button, Flex, Input, Switch, Tab, Tabs } from '@chakra-ui/core';
import moment from 'moment';

// Components
import { AnimationOnScroll, Icon, IHeadCell, NFTCard, Pagination, Select, Table } from '../../components';

// APIs
import { TransactionApi, WalletApi } from '../../apis';

// Interfaces
import { IWallet } from '../../shared/interfaces';

// Styles
import './styles.scss';

// Mock Data
import tabData from './mock_data.json';
import { updateWallet } from '../../apis/wallet.api';
import { useSelector } from 'react-redux';
import { getUser } from '../../store/selectors';


const CntPerPage = 5;

// Mock Select Options
const options = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Newest',
    value: 'newest',
  },
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


// Create wallet detail page
export const WalletDetailPage: FC = () => {
  const [tabId, setTabId] = useState<number>(0);
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [walletAsDefault, setWalletAsDefault] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(4);
  const [tableData, setTableData] = useState([]);
  const [pageLimit, setPageLimit] = useState<number>(5);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isWalletUpdate, setWalletUpdate] = useState<boolean>(false);
  const [walletName, setWalletName] = useState<string>('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  // Filter
  const [selectValue1, setSelectValue1] = useState('all');
  const [selectValue2, setSelectValue2] = useState('all');
  const [selectValue3, setSelectValue3] = useState('all');


  // Get user from store
  const user = useSelector(getUser);

  // Get wallet id from hook
  const { id: walletId } = useParams<{ id: string }>();

  useEffect(() => {
    if (walletId) {
      WalletApi.read(walletId)
        .then((res) => {
          setWallet(res.wallet);
          setWalletAsDefault(res.wallet.default)
          setWalletName(res.wallet.name)
        })
        .catch((err) => {
          console.log("🚀 ~ file: index.tsx:27 ~ useEffect ~ err:", err)
        })
    }
  }, [walletId]);

  // Set wallet name handler
  const walletNameHandler = (e: any) => {
    setWalletName(e.target.value)
  }

  // Set wallet as default handler
  const setWalletAsDefaultHandler = async (e: any) => {
    try {
      let value = e.target.checked
      setWalletAsDefault(e.target.checked);
      await updateWallet(walletId, { default: value })
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:66 ~ setWalletAsDefaultHandler ~ error:", error)

    }
  }

  // Fetch transactions
  const fetchTransactions = useCallback(() => {
    if (user && wallet?.address) {
      TransactionApi.gettransactions({
        query: {
          userId: user?.id,
          currency: wallet?.chain,
        },
        options: {
          limit: CntPerPage,
          skip: (pageNumber - 1) * CntPerPage,
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
    }
  }, [user, wallet, pageNumber, pageLimit]);

  useEffect(() => {
    if (tabId === 1) {
      fetchTransactions()
    }
  }, [tabId, wallet, pageNumber, fetchTransactions])

  const downloadKey = () => {
    if (wallet?._id) {
      WalletApi.downloadPrivateKey(wallet?._id as string, wallet?.chain)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${wallet.name}.pem`);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          console.log("🚀 ~ file: index.tsx:179 ~ useEffect ~ err:", err)
        })
    }
  }

  // Update wallet name handler
  const updateNameHandler = async () => {
    try {
      setLoading(true)
      await updateWallet(walletId, { name: walletName });
      setWalletUpdate(!isWalletUpdate);
      setLoading(false)
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:66 ~ setWalletAsDefaultHandler ~ error:", error)
      setLoading(false)
    }
  }



  // Return profile page
  return (
    <div className="wallet-detail-page">
      <div className="content">
        <div className="left-content">
          <div className="wallet-icon-container">
            {isWalletUpdate ? <Flex justifyContent="space-between">
              <Input
                name="name"
                value={walletName}
                className="d-form-outlined-input d-form-input--lime"
                onChange={walletNameHandler} />
              <Button className="d-update-button" isLoading={isLoading} onClick={updateNameHandler}>
                Update
              </Button>
            </Flex> : <>
              <Icon name="wallet" className="wallet-icon" />
              <div className="name-container">
                <h2 className="text-heading3">{walletName}</h2>
                <div onClick={() => setWalletUpdate(!isWalletUpdate)} >
                  <Icon name="edit" className="edit-icon" />
                </div>
              </div></>}
          </div>
          <div className="switch-wrapper">
            <Switch
              isChecked={walletAsDefault}
              onChange={setWalletAsDefaultHandler}
              className="d-switch"
            />
            <span className="switch-label">Default Wallet</span>
          </div>
          <div className="form">
            <div className="input-container">
              <label>Public Address</label>
              <Input variant="outline" value={wallet?.address} />
              <Icon name="copy" />
            </div>
            <div className="input-container">
              <label>Private Key</label>
              <Input type={`${showPrivateKey ? 'text' : 'password'}`} variant="outline" value={wallet?.privateKey} />
              {user?.isKYCVerified && <Icon name="download-file" onClick={downloadKey} />}
            </div>
            <p className="warning">
              Warning! <br />
              Never disclose this key. Anyone with your private keys can steal any assets held in your account.
            </p>
          </div>
          <Button className="d-outlined-button">
            Disconnect
          </Button>
        </div>

        <div className="right-content">
          <div className="tabs-wrapper">
            <Tabs className="tabs">
              {tabData.map((tab, index) => (
                <Tab
                  key={`tab-${index}`}
                  className={classnames('tab', {
                    active: index === tabId
                  })}
                  onClick={() => setTabId(index)}
                >
                  {tab.title}
                </Tab>
              ))}
            </Tabs>
            <div className="tab-panels">
              {tabId === 0 && (
                <div className='wallet-nfts'>
                  <div className="search-wrapper">
                    <div className="search-input">
                      <Input placeholder="SEARCH" />
                      <Icon name="search" />
                    </div>
                    <div className="dropdown-container">
                      <Select
                        options={options}
                        value={selectValue1}
                        onChange={(value) => setSelectValue1(value)}
                        className="select"
                      />
                      <Select
                        options={options}
                        value={selectValue2}
                        onChange={(value) => setSelectValue2(value)}
                        className="select"
                      />
                      <Select
                        options={options}
                        value={selectValue3}
                        onChange={(value) => setSelectValue3(value)}
                        className="select"
                      />
                    </div>

                  </div>
                  <div className="nft-cards">
                    {wallet?.address && wallet?.nfts?.map((item: any, index: number) => (
                      <AnimationOnScroll key={index} animation="animate__fadeIn">
                        {item?.productId && <NFTCard nft={item} />}
                      </AnimationOnScroll>
                    ))}
                  </div>
                </div>
              )}
              {tabId === 1 && <AnimationOnScroll animation="animate__fadeIn">
                <Table data={tableData} headCells={headCells} />
                <Pagination pageCnt={totalPage as number} activePage={pageNumber} onChange={setPageNumber} />
              </AnimationOnScroll>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

