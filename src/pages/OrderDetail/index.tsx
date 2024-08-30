// Dependencies
import React, { FC, useEffect, useState } from 'react';
import { Avatar, Button } from '@chakra-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';

// Components
import { AnimationOnScroll, Icon } from '../../components';

// Apis
import { OrderApi } from '../../apis';

// Global constants
import { REACT_APP_API_ASSET_SERVER } from '../../constants';

// Interfaces
import { IOrder, OrderStatus } from '../../shared/interfaces';

// Styles
import './styles.scss';
import { getDiscount } from '../Cart';

// Export order detail page
export const OrderDetailPage: FC = () => {
  // States
  const [order, setOrder] = useState<IOrder>();

  // Get params from hook
  const params = useParams<{ id: string }>();

  // Get history from hook
  const history = useHistory();

  // Go back handler
  const handleGoBack = () => {
    window.history.go(-1);
  };

  // Get title
  const getTitle = (orderStatus?: OrderStatus, isSub = false) => {
    switch (orderStatus) {
      case OrderStatus.Created: {
        return 'Processing';
      }

      case OrderStatus.Processed: {
        return isSub ? 'Delivered details' : 'Delivered';
      }

      case OrderStatus.Cancelled: {
        return 'Cancelled';
      }

      default: {
        return 'Processing';
      }
    }
  };

  // On params changed
  useEffect(() => {
    if (params?.id && !order) {
      OrderApi.read(params.id)
        .then((res) => {
          console.log(res);
          setOrder(res.order);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [params, order]);

  //get coin name
  const crypto: any = {
    ETH: ['ethereum', 'Ethereum'],
    CSPR: ['casper-coin', 'Casper'],
  };
  console.log("order", order)
  // Return order detail page
  return (
    <div className="order-detail-page">
      <AnimationOnScroll animation="animate__bounce" delay={2.5}>
        <div className="page-title">
          <h2 className="text-heading2">{getTitle(order?.status)}</h2>
        </div>
      </AnimationOnScroll>
      <div className='content'>
        <div className='header-container'>
          <div className='header-left-container'>
            <div className='header-left'>
              <h4 className="text-heading4 heading" >Product</h4>
              <h4 className="text-heading4 heading" >Category</h4>
              <h4 className="text-heading4 heading" >Price</h4>
            </div>
          </div>
          <div className='header-right' >
            <h4 className="text-heading4 detail-panel-title">{getTitle(order?.status, true)}</h4>
          </div>
        </div>
        <hr className="divider" />
        <hr className="divider-horizontal" />
        <div className='table-container' >
          <div className='product-container'>
            {order &&
              order?.orderItems?.map((product, index) => {
                console.log("🚀 ~ file: index.tsx:98 ~ order?.orderItems?.map ~ product:", product)
                return (
                  <div className="product-row"
                    onClick={() => {
                      if (product?.nftDetail?.details?.transactionHash) {
                        history.push(`/orders/${params?.id}/nft/${product?.nftDetail?.details.transactionHash}?name=${product.productName}`);
                      } else {
                        alert('Item could not be opened!')
                      }
                    }}>
                    <AnimationOnScroll key={index} animation="animate__slideInRight" className='product'>
                      <div className="product-name" >
                        <Avatar className="product-image" src={`${REACT_APP_API_ASSET_SERVER}/${product.thumbnail?.fieldname}/${product.thumbnail.filename}`} />
                        <span className="text-heading4">{product.productName}</span>
                      </div>
                      <span className="text-heading4 product-category" >{product.category.toString().replaceAll(",", ", ")}</span>
                      <span className="text-heading4 product-price" >
                        {product.currency}
                        {product.price}
                      </span>
                    </AnimationOnScroll>
                  </div>
                )
              })}
          </div>
          <div className='summary-container'>
            <h4 className="text-heading4 detail-panel-title">{getTitle(order?.status, true)}</h4>
            <hr className="divider" />
            <AnimationOnScroll animation="animate__slideInUp" delay={1.5}>
              <div className="summary">

                {order && order?.status === OrderStatus.Created && (
                  <div className="detail-steps">
                    <div className="detail-step">
                      <span className="text-body2">1</span>
                      <div className="step-divider" />
                      <span className="text-body2">2</span>
                      <div className="step-divider" />
                      <span className="text-body2">3</span>
                    </div>
                    <div className="detail-step-content">
                      <p className="text-heading4 label">Profile information verification</p>
                      <div className="detail-description text-body2">
                        {order.firstName ||
                          (order.lastName ? (
                            <>
                              {order.firstName || order.lastName}
                              <br />
                            </>
                          ) : order.username)}
                        {order.phoneNumber && (
                          <>
                            {order.phoneNumber}
                            <br />
                          </>
                        )}
                      </div>
                      <p className="text-heading4 label">Payment verification</p>
                      <div className="detail-description text-body2">
                        {order?.cryptoInfo ? `Prepaid ${crypto[`${order?.cryptoInfo?.currency}`][1]} Balance` : order.paymentMethod}
                        <br />
                        <span className="crypto-item">
                          {order?.cryptoInfo && <Icon name={crypto[`${order?.cryptoInfo?.currency}`][0]} />}
                          {order?.cryptoInfo?.amount}
                        </span>
                        <span className="crypto-item">${order.totalPrice}</span>
                      </div>
                      <p className="text-heading4 label">Delivery verification</p>
                      <div className="detail-description text-body2">
                        To <span className="customer-email">{order.email}</span>
                        <br />
                        <span> After receiving your order in your email inbox, approve it by clicking on the button below.</span>
                      </div>
                    </div>
                  </div>
                )}
                {order && order?.status === OrderStatus.Processed && (
                  <>
                    <div className="detail-item">
                      <span className="text-body1">Order code</span>
                      <span className="text-body1">{params.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="text-body1">Order date</span>
                      <span className="text-body1">
                        {moment(order.createdAt).format('DD MMM YYYY')}
                        <br />
                        {moment(order.createdAt).format('hh:mm:ss (Z)')}
                      </span>
                    </div>
                    <div className="divider" />
                    <div className="detail-item">
                      <span className="text-body1">Delivered to:</span>
                      <span className="text-body1">
                        {order.firstName ||
                          (order.lastName && (
                            <>
                              {order.firstName || order.lastName}
                              <br />
                            </>
                          ))}
                        {order.phoneNumber && (
                          <>
                            {order.phoneNumber}
                            <br />
                          </>
                        )}
                        {order.email && <>{order.email}</>}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="text-body1">Delivery date:</span>
                      <span className="text-body1">
                        {moment(order.updatedAt).format('DD MMM YYYY')}
                        <br />
                        {moment(order.updatedAt).format('hh:mm:ss (Z)')}
                      </span>
                    </div>
                    <div className="divider" />
                    <div className="detail-item">
                      <span className="text-body1">Payment method:</span>
                      <span className="text-body1">
                        {order?.cryptoInfo ? `Prepaid ${crypto[`${order?.cryptoInfo?.currency}`][1]}` : order.paymentMethod}
                        <br />
                        Balance
                      </span>
                    </div>
                    {order?.discount && order?.discount  > 0  && 
                         <div className="detail-item">
                         <span className="text-body1">Discount</span>
                         <span className="text-body1">
                            {order.discount}%
                           <br />
                           <span>
                             {order?.cryptoInfo && <Icon name={crypto[`${order?.cryptoInfo?.currency}`][0]} />}
                             {order?.cryptoInfo?.amount.toFixed(2)}
                           </span>
                         </span>
                       </div>}
                    <div className="detail-item">
                      <span className="text-body1">Total Amount</span>
                      <span className="text-body1">
                        {/* ${order.totalPrice?.toFixed(2)} */}
                        {getDiscount(order.totalPrice, order.discount as number, { tax_amount: order.vat })}
                        <br />
                        <span>
                          {order?.cryptoInfo && <Icon name={crypto[`${order?.cryptoInfo?.currency}`][0]} />}
                          {order?.cryptoInfo?.amount.toFixed(2)}
                        </span>
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="text-body1">Vat</span>
                      <span className="text-body1">
                        ${order.vat}
                        <br />
                      </span>
                    </div>
                  </>
                )}
                <div className="detail-actions">
                  <Button className="d-outlined-button back-button" onClick={handleGoBack}>
                    Back
                  </Button>
                </div>
              </div>
            </AnimationOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
};
