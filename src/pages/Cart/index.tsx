import { Button } from '@chakra-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { CartApi, OrderApi } from '../../apis';
import { AnimationOnScroll } from '../../components';
import { BuyModal } from '../../components/Modal/BuyModal';
import { CartModel } from '../../shared/models/cart.model';
import { addToCart } from '../../store/actions';
import { getCart, getUser } from '../../store/selectors';
import { validateCurrency } from '../../utils';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
import Product from './Product';
import './styles.scss';

export const getDiscount = (totalPrice: any, discount: number, tax: { tax_amount: any }) => {
  const subTotal = (totalPrice + (tax ? tax.tax_amount : 0)).toFixed(2);
  const discountedPrice = subTotal * (1 - discount / 100);
  return discountedPrice.toFixed(2);
};
export const CartPage: FC = () => {
  const [tax, setTax] = useState<any>();
  const [ipAddress, setIpAddress] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [showCouponModal, setShowCouponModal] = useState<boolean>(false);
  const history = useHistory();
  const { t } = useTranslation();

  const cart = useSelector(getCart);

  const user = useSelector(getUser);

  const dispatch = useDispatch();

  const handleCheckout = () => {
    if (cart?.total) history.push('/checkout');
  };

  useEffect(() => {
    OrderApi.getIpv4()
      .then((res) => setIpAddress(res.data.ip))
      .catch((err) => console.log(err));
  }, []);

  const setUserCart = useCallback(
    (userId: string) => {
      CartApi.read({
        fingerprint: userId
      })
        .then((res) => {
          dispatch(addToCart(new CartModel(res.cart)));
        })
        .catch((err) => {
          dispatch(addToCart(null));
          console.log(err);
        });
    },
    [dispatch]
  );

  useEffect(() => {
    setUserCart(user?.id as string);
  }, [user, setUserCart]);

  useEffect(() => {
    if (cart?.total && ipAddress) {
      OrderApi.getVat({
        amountToBePaid: cart?.total as number,
        buyerIpAddress: ipAddress
      })
        .then((res) => {
          OrderApi.getDetailsFromIp(ipAddress)
            .then((res) => {
              const timezone = res.data.timezone.split('/')[0];
              const currency = validateCurrency(timezone);
              setCurrency(currency);
            })
            .catch((err) => {
              console.log('🚀 ~ file: index.tsx:82 ~ .then ~ err:', err);
            });
          setTax(res.tax);
        })
        .catch((err) => console.log(err));
    }
  }, [cart, ipAddress]);

  TabTitle(t('Common.Cart - Digital Music Shopping Market Place'));
  metaTagByTitle(t('Common.Cart - Digital Music Shopping Market Place'));
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

  const removeCoupon = () => {
    if (user) {
      CartApi.addDiscount({ fingerprint: user.id, discount: 0 }).then((res) => {
        setUserCart(user?.id as string);
        setShowCouponModal(false);
      });
    }
  };
  return (
    <div className="cart-page">
      <AnimationOnScroll animation="animate__bounce" delay={2.5}>
        <div className="page-title">
          <h2 className="text-heading2">{t('Common.Cart')}.</h2>
        </div>
      </AnimationOnScroll>
      <div className="content">
        <div className="product-list">
          <div className="lead">
            <h4 className="text-heading4">{t('Common.Products')}</h4>
            <h4 className="text-heading4">{t('Checkout.Price')}</h4>
          </div>
          <hr className="divider" />
          <div className="products">
            {cart?.products?.map((product) => (
              <AnimationOnScroll key={product.id} animation="animate__slideInRight">
                <Product product={product} />
              </AnimationOnScroll>
            ))}
          </div>
        </div>
        <AnimationOnScroll animation="animate__slideInUp" delay={1.5} isSubElement className="checkout-panel">
          <h4 className="text-heading4 checkout-panel-title">{t('Checkout.You are almost there!')}</h4>
          <AnimationOnScroll
            animation="animate__disappear"
            delay={1.5}
            isSubElement
            className="checkout-panel-divider"
          />
          <div className="summary">
            <div className="summary-content">
              <div className="sub-total">
                <h4 className="text-heading4 text-heading4--lg">{t('Checkout.Subtotal')}:</h4>
                <h4 className="text-heading4 text-heading4--lg">
                  {currency} {cart ? cart?.total?.toFixed(2) : 0}
                </h4>
              </div>
              {cart && cart?.discount > 0 && (
                <div className="sub-total">
                  <h4 className="text-heading4 text-heading4--lg">Discount:</h4>
                  <h4 className="text-heading4 text-heading4--lg">{cart?.discount} %</h4>
                </div>
              )}
              <div className="sub-total">
                <h4 className="text-heading4 text-heading4--lg">{t('Checkout.VAT')}:</h4>
                <h4 className="text-heading4 text-heading4--lg">
                  {currency}
                  {tax ? tax.tax_amount : 0}
                </h4>
              </div>

              <div className="sub-total">
                <h3 className="text-heading3 text-heading3-md">{t('Checkout.Total')}:</h3>
                <h3 className="text-heading3 text-heading3-md text--lime">
                  {currency}
                  {cart && getDiscount(cart.total, cart?.discount, tax)}
                  {/* {((cart ? cart.total : 0) + (tax ? tax.tax_amount : 0)).toFixed(2)} */}
                </h3>
              </div>
            </div>
            {cart && cart?.products?.length > 0 && (
              <Button className="d-button check-out-button" onClick={handleCheckout}>
                {t('Checkout.Check Out')}
              </Button>
            )}
            {cart && cart?.discount === 0 ? (
              <p
                className="text-body1 text--cyan text--underline pointer--cursor"
                onClick={() => setShowCouponModal(true)}
              >
                Apply Coupon Code{' '}
              </p>
            ) : (
              <p className="text-body1 text--cyan text--underline pointer--cursor" onClick={removeCoupon}>
                Remove Coupon{' '}
              </p>
            )}
          </div>
        </AnimationOnScroll>
        <BuyModal
          isOpen={showCouponModal}
          onClose={() => setShowCouponModal(false)}
          cartDetail={cart}
          setUserCart={setUserCart}
          tax={tax}
        />
      </div>
    </div>
  );
};
