import { Flex, Spinner, Stack, useToast } from '@chakra-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import { GalleryApi, ProductApi } from '../../apis';
import { Alert } from '../../components';
import { PrimaryButton } from '../../components/Button/PrimaryButton';
import { CardSocialDescription, DetailsSection, PrimaryCard } from '../../components/Card/BannerProductCard';
import { CommonCardOutlet } from '../../components/Card/CommonCardOutlet';
import { ROUTES } from '../../constants';
import { PRODUCT_TYPE } from '../../shared/enums';
import { ProductModel } from '../../shared/models';
import { getUser } from '../../store/selectors';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
import './styles.scss';

export const ObjectsPage: FC = () => {
  const [product, setProduct] = useState<ProductModel>();
  const [similarProducts, setSimilarProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPublicProduct, setIsPublicProduct] = useState<boolean>(false);
  const [currentBidAmount, setCurrentBidAmount] = useState<number>(0);
  const [productAction, setProductAuction] = useState<any>();
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
        setProductAuction(res.product.auction);
        ProductApi.isPublicProduct(res.product.id).then((res) => {
          setIsPublicProduct(res.isPublic);
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
        });
      });
    ProductApi.readAll({ query: { type: PRODUCT_TYPE.OBJECT } })
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
      }
    }
  }, [productAction, user]);

  if (history.location.pathname === ROUTES.IMAGES.INDEX) {
    TabTitle(t('Common.Images - Digital Music Shopping Market Place'));
  }

  if (history.location.pathname === ROUTES.IMAGES.INDEX) {
    metaTagByTitle(t('Common.Images - Digital Music Shopping Market Place'));
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

  const content = (
    <div className="object-container">
      <div className="crypto-art-container">
        <div className="right-container">
          <CardSocialDescription
            tags={product?.category.map((cat) => cat.name)}
            sign={product?.sign?.url}
            title={product?.name}
            subTitle={product?.artistDetails?.name}
            artistDetails={product?.artistDetails}
            description={product?.description}
            productFeatures={product?.productFeatures}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
          />
        </div>
        <div className="left-container" style={{ justifyContent: 'end' }}>
          <div className="card">
            {/*  eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <PrimaryCard
              details={product}
              setCurrentBidAmount={setCurrentBidAmount}
              currentBidAmount={currentBidAmount}
            />
          </div>
        </div>
      </div>
      <Stack mt={'3%'} width={'80%'} alignSelf={'left'}>
        <h1 className="text-heading1">Trending Object</h1>
      </Stack>
      <div className="similar-track-container">
        {similarProducts?.map((item) => {
          return (
            <Stack h={[400, 400, 400, 450, 550]}>
              <CommonCardOutlet
                image={item.getThumbnailUrl}
                id={item.productURLId as string}
                type="product"
                object={item.object}
                productType={item.type}
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
    <div className="object-container">
      <Stack w="100%" mt={'5%'} alignItems={'center'} bg={'grey.400'}>
        <h1 className="text-heading3">Subscribe artist to see the product</h1>
        <PrimaryButton scheme="primary" mt={5} onClick={handleSubscribe}>
          Subscribe
        </PrimaryButton>
      </Stack>
    </div>
  );
  return loading ? (
    <div className="object-container">
      <Flex justifyContent="center" width={'100%'} alignItems="center" height={200}>
        <Spinner color="#00Ff00" size="xl" />
      </Flex>
    </div>
  ) : !user ? (
    isPublicProduct ? (
      content
    ) : (
      subscribeContent
    )
  ) : user && isPublicProduct ? (
    content
  ) : user?.subscribedArtist?.some((id) => id === product?.artistDetails?._id) ? (
    content
  ) : (
    subscribeContent
  );
};
