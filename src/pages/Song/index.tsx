import { Box, Flex, Spinner, Stack, useToast } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { GalleryApi, ProductApi } from '../../apis';
import { Alert } from '../../components';
import { PrimaryButton } from '../../components/Button/PrimaryButton';
import { ArtistCard } from '../../components/Card/ArtistCard';
import { AuctionCard, AuctionTable, CardAuctionDescription } from '../../components/Card/AuctionCards';
import { CardSocialDescription, DetailsSection, PrimaryCard } from '../../components/Card/BannerProductCard';
import { CommonCardOutlet } from '../../components/Card/CommonCardOutlet';
import { REACT_APP_API_ASSET_SERVER, ROUTES } from '../../constants';
import { PRODUCT_TYPE } from '../../shared/enums';
import { ProductModel } from '../../shared/models';
import { getUser } from '../../store/selectors';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
import './styles.scss';

export const SongPage = () => {
  const [product, setProduct] = useState<ProductModel>();
  const [similarProducts, setSimilarProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentBidAmount, setCurrentBidAmount] = useState<number>(0);
  const [productAction, setProductAuction] = useState<any>();
  const [isPublicProduct, setIsPublicProduct] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<any>([]);
  const user = useSelector(getUser);
  // Get product id from hook
  const { id: productId } = useParams<{ id: string }>();

  const toast = useToast();
  const { t } = useTranslation();

  const history = useHistory();
  // Data fetcher
  const fetchData = (productId: string) => {
    setLoading(true);
    ProductApi.read(productId)
      .then((res) => {
        setProduct(res.product);
        ProductApi.isPublicProduct(res.product.id).then((res) => {
          setIsPublicProduct(res.isPublic);
        });
        setLoading(false);
        setProductAuction(res.product.auction);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
        });
      });
    ProductApi.readAll({ query: { type: PRODUCT_TYPE.SONG } })
      .then((res) => {
        setLoading(false);
        setSimilarProducts(res.products);
      })
      .catch((err) => {
        setLoading(false);
        console.log('err=>', err);
      });
  };

  const handleSubscribe = () => {
    history.push(ROUTES.ARTIST.DETAIL.replace(':id', product?.artistDetails?.artistURLId as string));
  };
  // On product id changed
  useEffect(() => {
    fetchData(productId);
    // eslint-disable-next-line
  }, [productId, currentBidAmount]);

  useEffect(() => {
    if (user && productAction) {
      const bid = productAction.bids.find((bid: any) => bid.bidder == user.id);
      if (bid) {
        setCurrentBidAmount(bid.amount);
      } else {
        setCurrentBidAmount(0);
      }
    }
  }, [productAction, user]);

  if (history.location.pathname === ROUTES.SHOP.INDEX) {
    TabTitle(t('Common.Shop - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.EVENTS.INDEX) {
    TabTitle(t('Common.Events - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.SONGS.INDEX) {
    TabTitle(t('Common.Songs - Digital Music Shopping Market Place'));
  } else {
    TabTitle(t('Common.Products - Digital Music Shopping Market Place'));
  }

  if (history.location.pathname === ROUTES.SHOP.INDEX) {
    metaTagByTitle(t('Common.Shop - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.EVENTS.INDEX) {
    metaTagByTitle(t('Common.Events - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.SONGS.INDEX) {
    metaTagByTitle(t('Common.Songs - Digital Music Shopping Market Place'));
  } else {
    metaTagByTitle(t('Common.Products - Digital Music Shopping Market Place'));
  }
  metaTagByDesc(
    t('Common.Music-Store is founded on values we all share and are ready to stand for.') +
      ' ' +
      t('Common.They bring us together well beyond our current products and technologies.') +
      ' ' +
      t(
        'Common.They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
      )
  );
  metaTagByKey(t('Common.Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT'));
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);
  const tag = product?.category.map((item) => item.name);
  const auctionContent = (
    <Stack w={'100%'} height={'100%'} mt={['20%', '25%', '20%', '10%']} alignItems={'center'}>
      <Flex
        w={'80%'}
        flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
        justifyContent={'space-between'}
      >
        <Box
          w={['100%', '100%', '100%', '40%']}
          alignItems={'center'}
          justifyContent={'center'}
          display={'flex'}
          mt={['5%', '5%', '5%', '0%']}
        >
          {product && (
            <CardAuctionDescription
              tags={tag}
              title={t('Common.Song Art')}
              subTitle={product?.name}
              artistDetails={product?.artistDetails}
              description={product?.description}
              setCurrentBidAmount={setCurrentBidAmount}
              details={product}
              currentBidAmount={currentBidAmount}
            />
          )}
        </Box>
        <Box w={['100%', '100%', '100%', '50%']}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <AuctionCard details={product} />
        </Box>
      </Flex>
      {/* <Flex w={'80%'} justifyContent={'space-between'} mt={10}>
                <ArtistCard artistDetails={product?.artistDetails} statement={product?.statement} sign={product?.sign?.url} />
            </Flex> */}
      {product && (
        <Flex w={'80%'} justifyContent={'space-between'} mt={10}>
          <AuctionTable details={product} />
        </Flex>
      )}
    </Stack>
  );
  const content = (
    <div className="song-container">
      <div className="crypto-art-container">
        <div className="right-container">
          <CardSocialDescription
            tags={tag}
            sign={product?.sign?.url}
            title={product?.name}
            artistDetails={product?.artistDetails}
            subTitle={product?.artistDetails?.name}
            description={product?.description}
            productFeatures={product?.productFeatures}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
          />
        </div>
        <div className="left-container">
          <div className="primary-card">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <PrimaryCard
              details={product}
              setCurrentBidAmount={setCurrentBidAmount}
              currentBidAmount={currentBidAmount}
            />
          </div>
        </div>
      </div>

      {/* <div className="artist-state-container">
            <ArtistCard artistDetails={product?.artistDetails} statement={product?.statement} sign={product?.sign?.url} />
        </div> */}
      <Stack mt={'3%'} width={'80%'} alignSelf={'left'}>
        <h1 className="text-heading1">Similar Tracks</h1>
      </Stack>
      <div className="similar-track-container">
        {similarProducts?.slice(0, 9).map((item: ProductModel) => {
          return (
            <Stack h={[400, 400, 400, 450, 600]}>
              <CommonCardOutlet
                image={`${REACT_APP_API_ASSET_SERVER}/${item.thumbnail.fieldname}/${item.thumbnail.filename}`}
                id={item.productURLId as string}
                productType={item.type}
                type="product"
              >
                <DetailsSection details={item} />
              </CommonCardOutlet>
            </Stack>
          );
        })}
      </div>
    </div>
  );

  const subscribeContent = (
    <div className="song-container">
      <Stack w="100%" mt={'5%'} alignItems={'center'} bg={'grey.400'}>
        <h1 className="text-heading3">Subscribe artist to see the product</h1>
        <PrimaryButton scheme="primary" mt={5} onClick={handleSubscribe}>
          Subscribe
        </PrimaryButton>
      </Stack>
    </div>
  );
  return loading ? (
    <div className="song-container">
      <Flex justifyContent="center" width={'100%'} alignItems="center" height={200}>
        <Spinner color="#00Ff00" size="xl" />
      </Flex>
    </div>
  ) : !user ? (
    isPublicProduct ? (
      product?.isAuction ? (
        auctionContent
      ) : (
        content
      )
    ) : (
      subscribeContent
    )
  ) : user && isPublicProduct ? (
    product?.isAuction ? (
      auctionContent
    ) : (
      content
    )
  ) : user?.subscribedArtist?.some((id) => id === product?.artistDetails?._id) ? (
    product?.isAuction ? (
      auctionContent
    ) : (
      content
    )
  ) : (
    subscribeContent
  );
};
