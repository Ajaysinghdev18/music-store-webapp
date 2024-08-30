// Dependencies
import { useToast } from '@chakra-ui/core';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

// Apis
import { CartApi } from '../../../apis';
// Components
import { Alert } from '../..';
// Interfaces
import { CURRENCY } from '../../../shared/enums';
// Store
import { addToCart } from '../../../store/actions';
import { getCart, getUser } from '../../../store/selectors';
// Styles
import './styles.scss';
import { PrimaryButton } from '../PrimaryButton';
import { IAuction } from '../../../shared/interfaces/auction.interface';
import { ProductModel } from '../../../shared/models';

interface ICartButtonProps {
  product: ProductModel;
  productPrice: number;
  productCurrency: CURRENCY;
  color?: 'lime' | 'cyan';
  currency?: string;
  isAuction?: boolean;
  setBidModalVisible?: (value: boolean) => void;
  currentBidAmount?: number;
  auction?: IAuction;
  selectedFeature?: any;
  setBidAmount?: (value: string) => void;
}

// Create cart button
export const CartButton: FC<ICartButtonProps> = ({
  selectedFeature,
  product,
  productPrice,
  productCurrency,
  isAuction,
  setBidModalVisible,
  auction,
  setBidAmount
}) => {
  console.log("🚀 ~ file: index.tsx:46 ~ auction:", auction)
  // Get cart from store
  const cart = useSelector(getCart);

  // Get user from store
  const user = useSelector(getUser);

  // Get dispatch from hook
  const dispatch = useDispatch();

  // Get toast from hook
  const toast = useToast();
  const { t } = useTranslation();

  // Check product exists in cart
  const isInCart = useMemo(() => {
    let flag = false;
    if (cart && cart.products && cart.products.length > 0) {
      flag = cart.products.some(({ id }) => id === product?.id);
    }

    return flag;
  }, [product, cart]);

  // Check bidder exists in product
  const isBidder = useMemo(() => {
    let flag = false;
    if (auction && user) {
      const bid = auction?.bids?.find((bid: any) => bid.bidder == user?.id);
      if (bid) {
        flag = true;
        console.log("🚀 ~ file: index.tsx:78 ~ isBidder ~ isBidder:", flag, bid)
        setBidAmount && setBidAmount(bid.amount.toString())
      }
    }

    return flag;
  }, [product, user, auction]);

  // Toggle cart handler
  const handleToggleCart = () => {
    if (user) {
      if (isInCart) {
        CartApi.removeFromCart({
          productId: product.id as string,
          fingerprint: user.id,
          userId: user.id,
        })
          .then((res) => {
            dispatch(addToCart(res.cart));
            toast({
              position: 'top-right',
              render: ({ onClose }) => (
                <Alert message={t('Message.Removed from your cart!')} color="yellow" onClose={onClose} />
              )
            });
          })
          .catch((err) => {
            toast({
              position: 'top-right',
              render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
            });
          });
      } else {
        let featuresJsonString
        if (selectedFeature) {
          featuresJsonString = JSON.stringify(selectedFeature);
        } else {
          const defaultSelectedFeatures: any = [];
          if (product?.productFeatures.length > 0) {
            product?.productFeatures?.map((feat: any) => {
              if (feat.type === 'multiple') {
                const obj = { [feat.name]: feat.value[0] };
                defaultSelectedFeatures.push(obj);
              }
            });
          }
          featuresJsonString = JSON.stringify(defaultSelectedFeatures);
        }

        CartApi.addToCart({
          productId: product.id as string,
          fingerprint: user.id,
          price: productPrice,
          currency: productCurrency,
          userId: user.id,
          selectedFeature: featuresJsonString
        })
          .then((res) => {
            dispatch(addToCart(res.cart));
            toast({
              position: 'top-right',
              render: ({ onClose }) => (
                <Alert message={t('Message.Successfully added to the cart!')} onClose={onClose} />
              )
            });
          })
          .catch((err) => {
            toast({
              position: 'top-right',
              render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
            });
          });
      }
    } else {
      toast({
        position: 'top-right',
        render: ({ onClose }) => (
          <Alert message={t('Message.Login to the platform first!')} color="cyan" onClose={onClose} />
        )
      });
    }
  };

  // Toggle cart handler
  const handleToggleSendBid = () => {
    if (user) {
      setBidModalVisible && setBidModalVisible(true);
    } else {
      toast({
        position: 'top-right',
        render: ({ onClose }) => (
          <Alert message={t('Message.Login to the platform first!')} color="cyan" onClose={onClose} />
        )
      });
    }
  };

  // Return cart button
  return (
    <PrimaryButton scheme='primary' onClick={isAuction ? handleToggleSendBid : handleToggleCart}>
      <p className='text-body1'>
        {isAuction ? isBidder ? 'Show Bid' : 'Send Bid' : isInCart ? t('Common.Added to Cart') : t('Common.Add to Cart')}
      </p>
    </PrimaryButton>
  );
};
