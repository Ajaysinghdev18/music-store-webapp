import { Flex, Stack, Tag, useToast } from '@chakra-ui/core';
import moment from 'moment';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiSolidShareAlt } from 'react-icons/bi';
import { IoChevronForwardOutline, IoClose, IoCopy } from 'react-icons/io5';
import { SiFacebook, SiTwitter } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { AuctionApi, CartApi } from '../../../apis';
import Quotes from '../../../assets/images/“.png';
import { ROUTES } from '../../../constants';
import { CURRENCY, PRODUCT_TYPE } from '../../../shared/enums';
import { IArtist } from '../../../shared/interfaces';
import { ProductModel } from '../../../shared/models';
import { addToCart } from '../../../store/actions';
import { getCart, getUser } from '../../../store/selectors';
import { copyTextToClipboard } from '../../../utils';
import { Alert } from '../../Alert';
import { CartButton } from '../../Button/CartButton';
import { FavouriteButton } from '../../Button/FavouriteButton';
import { PrimaryButton } from '../../Button/PrimaryButton';
import { BidModal } from '../../Modal/BidModal';
import { ObjectRender } from '../../ObjectRender';
import { Audio } from '../../SeekbarAudio';
import CustomVideo from '../../VideoPlayer';
import './styles.scss';

interface IDetailsSection {
  details: ProductModel;
  isPrimaryCard?: boolean;
  setCurrentBidAmount?: (amount: number) => void;
  currentBidAmount?: number;
  selectedFeature?: any;
  isHome?: boolean;
}
export const DetailsSection = ({
  details,
  selectedFeature,
  isPrimaryCard,
  setCurrentBidAmount,
  isHome = false
}: IDetailsSection) => {
  const [openShare, setOpenShare] = useState<boolean>(false);
  const [bidModalVisible, setBidModalVisible] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<string>('');
  const history = useHistory();
  const toast = useToast();

  const productType = details?.type;
  let route: any;

  if (productType === PRODUCT_TYPE.IMAGES) {
    route = ROUTES.IMAGES.INDEX;
  } else if (productType === PRODUCT_TYPE.MERCHANDISE) {
    route = ROUTES.MERCHANDISE.INDEX;
  } else if (productType === PRODUCT_TYPE.OBJECT) {
    route = ROUTES.OBJECTS.INDEX;
  } else if (productType === PRODUCT_TYPE.VIDEOS) {
    route = ROUTES.VIDEOS.INDEX;
  } else if (productType === PRODUCT_TYPE.VIRTUAL_EVENT) {
    route = ROUTES.EVENTS.INDEX;
  } else if (productType === PRODUCT_TYPE.SONG) {
    route = ROUTES.SONGS.INDEX;
  } else {
    route = ROUTES.SONGS.INDEX;
  }

  const { t } = useTranslation();

  const onCopy = () => {
    copyTextToClipboard(`https:/www.music-store.com/${route}${details?.id}` as string);
    toast({
      position: 'top-right',
      render: ({ onClose }) => <Alert message={'Copied to Clipboard'} onClose={onClose} />
    });
  };
  const style = isPrimaryCard ? 'primary' : 'common';

  const handleBidCreation = () => {
    AuctionApi.createBid({ amount: bidAmount, coin: details.chain }, details?.auction?.id as string)
      .then((res) => {
        console.log('res', res);
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={'Bid Send Successfully'} onClose={onClose} />
        });
        setBidModalVisible(false);
        setCurrentBidAmount && setCurrentBidAmount(+bidAmount);
        details.auction = res.auction;
      })
      .catch((err) => {
        toast({
          position: 'top-right',
          render: ({ onClose }) => (
            <Alert color="yellow" message={'Error while creating bid, Please try again'} onClose={onClose} />
          )
        });
        setBidModalVisible(false);
        console.log(err);
      });
  };

  return openShare ? (
    <Stack height={'100%'} display={'flex'} zIndex={100} justifyContent={'space-between'} alignItems={'end'}>
      <IoClose onClick={() => setOpenShare(false)} cursor={'pointer'} size={25} color="white" />
      <Stack w={'100%'} justifyContent={'space-between'} display={'flex'} flexDirection={'row'} zIndex={100}>
        <p
          style={{ width: '70%', textOverflow: 'ellipsis', overflow: 'hidden' }}
        >{`https:/www.music-store.com/${route}/${details?.id}`}</p>
        <IoCopy cursor={'pointer'} size={15} color="white" onClick={onCopy} />
      </Stack>
      <PrimaryButton scheme="basic" w="100%">
        {' '}
        <SiFacebook /> <p className="text-body1">FACEBOOK</p>
      </PrimaryButton>
      <PrimaryButton scheme="basic" w="100%">
        {' '}
        <SiTwitter /> <p className="text-body1">Twitter</p>
      </PrimaryButton>
    </Stack>
  ) : (
    <Stack height={'100%'} justifyContent={'space-between'}>
      {details?.type == PRODUCT_TYPE.SONG ? (
        <Stack mt={5} justifyContent={'center'}>
          {details?.id !== 'undefined' && details?.music?.url && <Audio src={details?.preview?.url} />}
        </Stack>
      ) : null}
      <div
        className={`${style}-detail-section-container`}
        style={{ height: details?.type == PRODUCT_TYPE.SONG ? '70%' : '100%' }}
      >
        <div className={`${style}-details-section`}>
          <Link
            className={`${style}-product-details-section`}
            style={{ textDecoration: 'none' }}
            to={`${route}/${details?.productURLId}`}
          >
            <p className="text-heading4">{details?.name}</p>
            {details?.type === PRODUCT_TYPE.VIRTUAL_EVENT ? null : (
              <Stack alignItems={'center'} display={'flex'} flexDirection={'row'}>
                <p className="text-heading4" style={{ marginLeft: 5 }}>
                  {details?.currency}
                  {details?.price}
                </p>
              </Stack>
            )}
          </Link>
          <div className={`${style}-icon-container`}>
            <FavouriteButton product={details} />
            <BiSolidShareAlt size={25} color="white" onClick={() => setOpenShare(!openShare)} cursor={'pointer'} />
          </div>
        </div>
        <div className={`${style}-button-section`}>
          {details?.artistDetails ? (
            <Link
              className={`${style}-artist-detail-section`}
              style={{ textDecoration: 'none' }}
              to={`${ROUTES.ARTIST.LIST}/${details?.artistDetails?.artistURLId}`}
            >
              <div className={`${style}-artist-image`}>
                <img src={details?.artistDetails?.thumbnail} />
              </div>
              <p className="text-body1"> by {details?.artistDetails?.name}</p>
            </Link>
          ) : (
            <div></div>
          )}

          {isHome ? (
            <PrimaryButton
              scheme="primary"
              onClick={() => {
                history.push(`${route}/${details.productURLId}`);
              }}
            >
              <p className="text-body1">View Product</p>
            </PrimaryButton>
          ) : (
            <CartButton
              color={'lime'}
              selectedFeature={selectedFeature}
              product={details}
              productPrice={details?.price as number}
              productCurrency={details?.currency as CURRENCY}
              isAuction={!details?.isAuction ? false : true}
              setBidModalVisible={setBidModalVisible}
              auction={details?.auction}
              setBidAmount={setBidAmount}
            />
          )}
        </div>
      </div>
      <BidModal
        handleClick={handleBidCreation}
        setBidAmount={setBidAmount}
        bidAmount={bidAmount}
        isOpen={bidModalVisible}
        onClose={() => setBidModalVisible(false)}
        details={details}
      />
    </Stack>
  );
};

export const PrimaryCard = ({
  details,
  setCurrentBidAmount,
  currentBidAmount,
  selectedFeature,
  isHome = false
}: IDetailsSection) => {
  return (
    <div className="primary-card-container">
      <div className="gradiant-top" />
      <div className="gradiant-bottom" />
      <div className="product-image">
        {details?.object ? (
          <ObjectRender
            id={details?.id}
            canAction
            fieldname={details?.object?.fieldname}
            filename={details.object.filename}
          />
        ) : details?.type === 'video' || details?.type === 'product' ? (
          <CustomVideo videoUrl={details.preview?.url} />
        ) : (
          <img height="100%" width={'100%'} src={`${details?.thumbnail?.url}?timestamp=${Date.now()}`} />
        )}
      </div>
      <div className="product-details">
        <DetailsSection
          isHome={isHome}
          details={details}
          isPrimaryCard={true}
          setCurrentBidAmount={setCurrentBidAmount}
          currentBidAmount={currentBidAmount}
          selectedFeature={selectedFeature}
        />
      </div>
    </div>
  );
};

interface ICardSocialDescription {
  title?: string | any;
  isArtistPage?: boolean;
  subTitle?: string;
  description?: string;
  tags?: Array<string>;
  sign?: any;
  artistDetails?: IArtist;
  productFeatures?: any;
  selectedFeature?: any;
  setSelectedFeature?: any;
}
export const CardSocialDescription: FC<ICardSocialDescription> = ({
  title,
  productFeatures,
  tags,
  isArtistPage = false,
  subTitle,
  description,
  sign,
  artistDetails,
  selectedFeature,
  setSelectedFeature
}) => {
  useEffect(() => {
    if (selectedFeature && productFeatures.length > 0) {
      const defaultSelectedFeatures: any = [];
      productFeatures?.map((feat: any) => {
        if (feat.type === 'multiple') {
          const obj = { [feat.name]: feat.value[0] };
          defaultSelectedFeatures.push(obj);
        }
      });
      setSelectedFeature(defaultSelectedFeatures);
    }
  }, []);
  const handleButtonClick = (featureName: string, selectedValue: string) => {
    setSelectedFeature((prevSelectedFeature: any) => {
      const existingFeature = prevSelectedFeature.find((selectedFeat: any) => selectedFeat[featureName]);

      if (existingFeature) {
        // If the feature is already selected, toggle the selection
        const updatedSelectedFeature = prevSelectedFeature.map((selectedFeat: any) => {
          if (selectedFeat[featureName]) {
            return { [featureName]: selectedValue };
          }
          return selectedFeat;
        });
        return updatedSelectedFeature;
      } else {
        // If the feature is not selected, add it to the selected features
        return [...prevSelectedFeature, { [featureName]: selectedValue }];
      }
    });
  };
  return (
    <div className="card-social-description-container">
      <div className="tag-container">
        {tags?.map((tag) => {
          return (
            <PrimaryButton fontSize={18} scheme="primary">
              <p className="text-body1">{tag}</p>
            </PrimaryButton>
          );
        })}
      </div>
      <div className="description">
        <h1 className="text-heading1">{title}</h1>
        <h2 className="text-heading2">{subTitle}</h2>
        <p className="text-body1">{description}</p>
      </div>
      <div className="divider" />
      {!isArtistPage && (
        <div className="social-description">
          <Link
            to={ROUTES.ARTIST.DETAIL.replace(':id', artistDetails?.artistURLId as string)}
            style={{ display: 'flex', textDecoration: 'none', alignItems: 'center' }}
          >
            <Stack
              h={[10, 10, 15, 30, 50]}
              w={[10, 10, 15, 30, 50]}
              borderRadius={20}
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
              mr={10}
            >
              <img src={artistDetails?.thumbnail} style={{ height: '100%', width: '100%', borderRadius: '50%' }} />
            </Stack>
            <p className="text-body1">By {artistDetails?.name}</p>
          </Link>
        </div>
      )}
      {productFeatures && productFeatures.length > 0 && (
        <>
          <Stack display={'flex'} flexDirection={'row'} gridGap={10} mt={10} flexWrap={'wrap'}>
            {productFeatures.map((item: any) => {
              return (
                item.type === 'single' && (
                  <Tag color={'cyan'} background={'cyan'} w={'fit-content'}>
                    {' '}
                    <p className="text-body1" style={{ color: 'black' }}>
                      {item.name} | {item.value}
                    </p>
                  </Tag>
                )
              );
            })}
          </Stack>
          {productFeatures.map((item: any) => {
            const selectedFeat = selectedFeature?.find((selectedFeat: any) => selectedFeat[item.name]);
            return (
              item.type === 'multiple' && (
                <Flex alignItems={'center'} mt={5}>
                  <p className="text-body1" style={{ color: 'white' }}>
                    {item.name} :
                  </p>
                  {item.value.map((val: string) => (
                    <PrimaryButton
                      ml={10}
                      fontSize={18}
                      scheme={selectedFeat && selectedFeat[item.name] === val ? 'primary' : 'basic'}
                      onClick={() => handleButtonClick(item.name, val)}
                    >
                      <p className="text-body1">{val}</p>
                    </PrimaryButton>
                  ))}
                </Flex>
              )
            );
          })}
        </>
      )}
    </div>
  );
};

export const CommunityEventImageCard = ({ details, isHome = false }: IDetailsSection) => {
  return (
    <div className="primary-card-container">
      <div className="gradiant-top" />
      <div className="gradiant-bottom" />
      <Stack w="100%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
        <Stack display={'flex'} flexDirection={'row'} width={'70%'} flexWrap={'wrap'} gridGap={'5px'}>
          <PrimaryButton scheme="primary" p={2}>
            <p className="text-body1">{moment(details?.startTime).format('DD.MM.YYYY')}</p>
          </PrimaryButton>
          <PrimaryButton scheme="primary" p={2}>
            <p className="text-body1">{moment(details?.startTime).format('HH A')}</p>
          </PrimaryButton>
        </Stack>
        <Stack w={'20%'} alignItems={'end'}>
          <PrimaryButton scheme="primary">
            <p className="text-body1">
              {details?.price} {details?.currency}
            </p>
          </PrimaryButton>
        </Stack>
      </Stack>

      <div className="product-image">
        <CustomVideo videoUrl={details?.video?.url} />
      </div>

      <div className="product-details">
        <DetailsSection details={details} isPrimaryCard={true} isHome={isHome} />
      </div>
    </div>
  );
};
interface ICommunityEventDescriptionCard {
  tags: string[] | any;
  title?: string | any;
  subTitle?: string | any;
  description?: string;
  artistDetails?: IArtist;
  onViewClick?: any;
}
export const CommunityEventDescriptionCard: FC<ICommunityEventDescriptionCard> = ({
  tags,
  onViewClick,
  artistDetails,
  title,
  subTitle,
  description
}) => {
  return (
    <div className="community-event-description-container">
      <div className="tag-container">
        {tags &&
          tags.map((tag: string) => {
            return (
              <PrimaryButton fontSize={18} scheme="primary">
                {tag}
              </PrimaryButton>
            );
          })}
      </div>
      <div className="description">
        <h1 className="text-heading1">{title}</h1>
        <h2 className="text-heading2">{subTitle}</h2>
        <Stack display={'flex'} mt={27} mb={52} w={'100%'} flexDirection={'row'}>
          <PrimaryButton rightIcon={<IoChevronForwardOutline />} onClick={onViewClick} scheme="basic">
            <p className="text-body1">View</p>
          </PrimaryButton>
        </Stack>
        {/* <img src={Quotes} /> */}
        <Stack w={['100%', '100%', '60%', '60%', '60%']}>
          <p className="text-body1">{description}</p>
        </Stack>
      </div>
      <Flex className="divider" mt={10} mb={10} />
      <Stack display={'flex'} flexDirection={'row'} mt={5} width={'100%'}>
        <Stack display={'flex'} ml={'5%'} flexDirection={'row'} alignItems={'center'}>
          <Stack
            h={[10, 10, 15, 30, 50]}
            w={[10, 10, 15, 30, 50]}
            borderRadius={20}
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            mr={10}
          >
            <img src={artistDetails?.thumbnail} style={{ height: '100%', width: '100%', borderRadius: '50%' }} />
          </Stack>
          <p className="text-body1">By {artistDetails?.name}</p>
        </Stack>
      </Stack>
    </div>
  );
};
