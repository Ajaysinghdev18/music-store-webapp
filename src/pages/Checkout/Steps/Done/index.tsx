// Dependencies
import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Button } from '@chakra-ui/core';

// Constants
import { ROUTES } from '../../../../constants';
import { Icon } from '../../../../components';
import { getOrder } from '../../../../store/selectors';
import { useSelector } from 'react-redux';
import { OrderApi } from '../../../../apis';
import { IOrder } from '../../../../shared/interfaces';
import moment from 'moment';
import { getDiscount } from '../../../Cart';
import { useTranslation } from 'react-i18next';

interface DoneStepProps {
  orderId?: string;
}

// Export Done step
export const DoneStep: FC<DoneStepProps> = ({ orderId }) => {
  // States
  const [order, setOrder] = useState<IOrder>();

  // Get history from hook
  const history = useHistory();

  // Get cart from store
  const newOrder = useSelector(getOrder);


  // Go to home page
  const goToHome = () => {
    history.push(ROUTES.HOME);
  };

  // On params changed
  useEffect(() => {
    if (orderId || newOrder?.orderId) {
      OrderApi.read(orderId ? orderId : newOrder?.orderId)
        .then((res) => {
          console.log(res);
          setOrder(res.order);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [orderId, newOrder?.orderId]);

  const crypto: any = {
    ETH: ['ethereum', 'Ethereum'],
    CSPR: ['casper-coin', 'Casper'],
  };

const { t } = useTranslation()
  // Return order detail page

  // Return Done step
  return (
    <div className="confirm-section">
      <Icon name="thankyou" />
      <h3 className="text-heading3 text--color">Thank you!</h3>
      <p className="text-body1">{t('Checkout.Check out your email inbox, your order will be there waiting for you')}</p>
      <Button className="d-button back-home-button" onClick={goToHome}>
       {t('Checkout.Back to home')}
      </Button>
      <div className='order-details'>
        <div className='summary'>
          <p>
            Order Details
          </p>
          <Icon name='print' />
        </div>
        <hr className='order-divider' />
        <div className="detail-item">
          <span className="text-body1">Order code</span>
          <span className="text-body1">{order?.txKey}</span>
        </div>
        <div className="detail-item">
          <span className="text-body1">Order date</span>
          <span className="text-body1">
            {moment(order?.createdAt).format('DD MMM YYYY')}
            <br />
            {moment(order?.createdAt).format('hh:mm:ss (Z)')}
          </span>
        </div>
        <hr className='order-divider' />
        <div className="detail-item">
          <span className="text-body1">Delivered to:</span>
          <span className="text-body1">
            {order?.firstName ||
              (order?.lastName && (
                <>
                  {order?.firstName || order?.lastName}
                  <br />
                </>
              ))}
            {order?.phoneNumber && (
              <>
                {order?.phoneNumber}
                <br />
              </>
            )}
            {order?.email && <>{order?.email}</>}
          </span>
        </div>
        <hr className='order-divider' />
        <div className="detail-item">
          <span className="text-body1">Payment method:</span>
          <span className="text-body1">
            {order?.cryptoInfo ? `Prepaid ${crypto[`${order?.cryptoInfo?.currency}`][1]}` : order?.paymentMethod}
            <br />
            Balance
          </span>
        </div>
        <hr className='order-divider' />
        <div className="detail-item">
          <span className="text-body1">Discount:</span>
          <span className="text-body1">
            { order?.discount && `${order?.discount}%`}
          </span>
        </div>
        <hr className='order-divider' />
        <div className="detail-item">
          <span className="text-body1">Total Amount</span>
          <span className="text-body1">
            {getDiscount(order?.totalPrice, order?.discount as number, order?.vat)}
            {/* ${totalAmount(order?.totalPrice, order?.vat)} */}
            <br />
            <span>
              {order?.cryptoInfo && <Icon name={crypto[`${order?.cryptoInfo?.currency}`][0]} />}
              {order?.cryptoInfo?.amount.toFixed(2)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
