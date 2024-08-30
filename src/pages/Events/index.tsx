import { Flex, Spinner, Stack, useToast } from '@chakra-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { GalleryApi, ProductApi } from '../../apis';
import { Alert, AnimationOnScroll } from '../../components';
import { REACT_APP_API_ASSET_SERVER, ROUTES } from '../../constants';
import { PRODUCT_TYPE } from '../../shared/enums';
import { ProductModel } from '../../shared/models';
import './styles.scss';
import { CommunityEventDescriptionCard, CommunityEventImageCard, DetailsSection } from '../../components/Card/BannerProductCard';
import { CommonCardOutlet } from '../../components/Card/CommonCardOutlet';
import { SuggestionSection } from '../../components/Card/TopCollectionCard';
import moment from 'moment';
import { PrimaryButton } from '../../components/Button/PrimaryButton';
import { useSelector } from 'react-redux';
import { getUser } from '../../store/selectors';


export const EventsPage: FC = () => {
  const [product, setProduct] = useState<ProductModel>();
  const [similarProducts, setSimilarProducts] = useState<ProductModel[]>([]);
  const [pastEvents, setPastEvents] = useState<ProductModel[]>([]);
  const [futureEvents, setFutureEvents] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isPublicProduct, setIsPublicProduct] = useState<boolean>(false)

  const user = useSelector(getUser)
  // Get product id from hook
  const { id: productId } = useParams<{ id: string }>();

  const toast = useToast();
  const history = useHistory()
  // Data fetcher
  const fetchData = (productId: string) => {
    setLoading(true)
    ProductApi.read(productId)
      .then((res) => {
        ProductApi.isPublicProduct(res.product.id).then(res => {
          setIsPublicProduct(res.isPublic)
        })
        setProduct(new ProductModel(res.product));
      })
      .catch((err) => {
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
        });
      });
    ProductApi.readAll({ query: { type: PRODUCT_TYPE.VIRTUAL_EVENT } })
      .then((res) => {
        setLoading(false)
        setSimilarProducts(res.products);
        const todayDate = moment();
        const pastEvent: ProductModel[] = [];
        const futureEvent: ProductModel[] = [];
        res.products.map((event: any) => {
          const startDate = moment(event.startTime);
          const endDate = moment(event.endTime);
          if (todayDate.isBefore(startDate)) {
            // Event is in the future
            futureEvent.push(event);
          } else if (todayDate.isSameOrAfter(startDate) && todayDate.isSameOrBefore(endDate)) {
            // Event is ongoing
            futureEvent.push(event);
          } else {
            // Event is in the past
            pastEvent.push(event);
          }
        })
        setFutureEvents(futureEvent)
        setPastEvents(pastEvent)
      })
      .catch((err) => {
        setLoading(false)
        console.log("err=>", err);
      });

  };

  const handleSubscribe = () => {
    history.push(ROUTES.ARTIST.DETAIL.replace(':id', product?.artistDetails?.artistURLId as string))
  }
  // On product id changed
  useEffect(() => {
    fetchData(productId);
    // eslint-disable-next-line
  }, [productId]);

  const content = (
    <div className={'event-page'}>
      <div className="crypto-art-container">
        <div className="right-container">
          <CommunityEventDescriptionCard
            tags={product?.categoryNamesArray}
            title={product?.name}
            artistDetails={product?.artistDetails}
            description={product?.description} />
        </div>
        <div className="left-container">
          {product &&
            <div className='card'>
              <CommunityEventImageCard details={product} />
            </div>
          }
        </div>
      </div>
      {/* <Stack w={'80%'}>
        <SuggestionSection
          futureData={futureEvents}
          pastData={pastEvents}
          titleName='Upcoming Events'
          historyTitleName={'Event History'} />
      </Stack> */}
      {/* <Stack w={'80%'} my={'3%'} justifyContent={'start'}>
        <h1 className='text-heading1'>Trending Events</h1>
      </Stack>
      <div className="content">
        {isLoading ? (
          <Flex justifyContent="center" width={'100%'} alignItems="center" height={200}>
            <Spinner color="#00Ff00" size="xl" />
          </Flex>
        ) : (
          <div className="products-container">
            {similarProducts.length > 0 &&
              similarProducts.map((product) => (
                <AnimationOnScroll key={product.id} animation="animate__fadeIn" isSubElement>
                  <Stack h={[400, 400, 400, 450, 550]}>
                    <CommunityEventImageCard details={product} />
                  </Stack>
                </AnimationOnScroll>
              ))}
          </div>
        )}
      </div> */}
    </div>
  )
  const subscribeContent = (
    <div className="object-container">
      <Stack w='100%' mt={'5%'} alignItems={'center'} bg={'grey.400'}>
        <h1 className='text-heading3'>
        Do you want to see this artist digital assets
        </h1>
        <PrimaryButton scheme="primary" mt={5} onClick={handleSubscribe}>
          Subscribe
        </PrimaryButton>
      </Stack>
    </div>
  )
  return (
    loading ?
      <div className="object-container">
        <Flex justifyContent="center" width={'100%'} alignItems="center" height={200}>
          <Spinner color="#00Ff00" size="xl" />
        </Flex>
      </div> : !user ?
        isPublicProduct ?
          content :
          subscribeContent
        : user && isPublicProduct ? content : user?.subscribedArtist?.some(id => id === product?.artistDetails?._id) ?
          content :
          subscribeContent
  );
};
