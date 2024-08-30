// Dependencies
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

// Components
import { AnimationOnScroll } from '../../../components';

// Styles
import './styles.scss';
import { getTransactionDetails } from '../../../apis/product.api';
import { Button, Flex, Stack } from '@chakra-ui/core';

// Export order detail page
export const OrderNftDetailPage: FC = () => {
  // States
  const [nft, setNft] = useState<any>({});

  // Get params from hook
  const hash = useParams<{ tx: string }>();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get('name');

  const getTransaction = useCallback(async () => {
    const res = await getTransactionDetails(hash?.tx as string);
    setNft(res.nft);
  }, [hash]);

  const handleGoBack = (e: any) => {
    window.history.go(-1);
  }

  useEffect(() => {
    if (hash?.tx) {
      getTransaction();
    }
  }, [hash, getTransaction]);

  // Return order nft detail page
  return (
    <div className="order-nft-detail-page">
      <Button onClick={handleGoBack} w={'fit-content'} marginLeft={'5%'} className="d-outlined-button">
        Back
      </Button>
      <div className='order-nft-detail-page-container'>
        <AnimationOnScroll animation="animate__bounce" delay={2.5} className='page-title-container'>
          <div className="page-title">
            <h2 className="text-heading2">{name}</h2>
          </div>
        </AnimationOnScroll>
        <AnimationOnScroll animation="animate__slideInUp" delay={1.5} isSubElement className="detail-panel">
          <Flex w={'100%'} justifyContent={'space-between'}>
            <p className="text-body1">Network:</p>
            <p className="text-body1">{nft?.details?.chain}</p>
          </Flex>
          <hr className='divider' />
          <Flex w={'100%'} justifyContent={'space-between'}>
            <p className="text-body1">TokenId:</p>
            <p className="text-body1">{nft?.tokenId}</p>
          </Flex>
          <hr className='divider' />
          <Flex w={'100%'} justifyContent={'space-between'}>
            <Stack w={'20%'}>
              <p className="text-body1">To:</p>
            </Stack>
            <Stack w={'80%'} alignItems={'end'}>
              <p className='text-body1 overflow-ellipsis'>
              {nft?.details?.to}
              </p>
            </Stack>

          </Flex>
          <hr className='divider' />
          <Flex w={'100%'} justifyContent={'space-between'}>
            <Stack w={'20%'}>
              <p className="text-body1">TxHash:</p>
            </Stack>
            <Stack w={'80%'} alignItems={'end'}>
              <p className="text-body1 overflow-ellipsis">{nft?.details?.transactionHash}</p>
            </Stack>
          </Flex>
          <hr className='divider' />
        </AnimationOnScroll>
      </div>
    </div>
  );
};
