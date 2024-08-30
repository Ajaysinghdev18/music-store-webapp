import { Flex, Spinner, useToast } from '@chakra-ui/core';
import classnames from 'classnames';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { OrderApi, UserApi } from '../../../../apis';
import { Alert, AnimationOnScroll, IIcon, Icon, IconButton } from '../../../../components';
import { REACT_APP_API_ASSET_SERVER, ROUTES } from '../../../../constants';
import { IMessage, IOrder, IShopHistory, ISortOrder, OrderStatus } from '../../../../shared/interfaces';
import { getUser } from '../../../../store/selectors';
import { formatDate } from '../../../../utils';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../utils/generaltittlefunction';
import { getDiscount } from '../../../Cart';
import './styles.scss';

enum OrderTab {
  Processing = 'Processing',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

const defaultOrdersByStatus = [
  {
    icon: 'processing',
    status: OrderTab.Processing,
    count: 0
  },
  {
    icon: 'shopping-bag-check',
    status: OrderTab.Delivered,
    count: 0
  },
  {
    icon: 'shopping-bag-x',
    status: OrderTab.Cancelled,
    count: 0
  }
];

export const DashboardTab = () => {
  const [shopHistories, setShopHistories] = useState<IShopHistory[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleOrders, setVisibleOrders] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<OrderTab>(OrderTab.Processing);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);

  const toast = useToast();

  const history = useHistory();

  const { t } = useTranslation();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get('type');

  const user = useSelector(getUser);

  const { state } = useLocation<{ tab: OrderTab }>();

  const fetchOrders = useCallback(() => {
    OrderApi.readAll({
      query: {
        userId: user?.id
      }
    })
      .then((res) => {
        console.log('res.orders', res.orders);
        setAllOrders(res.orders);
      })
      .catch((err) => console.log(err));
  }, [user]);

  const fetchMessages = useCallback(() => {
    setLoading(true);
    UserApi.getMessages({
      options: {
        sort: {
          updatedAt: ISortOrder.DESC
        }
      }
    })
      .then((res) => {
        setMessages(res.messages);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
        });
      })
      .finally(() => setLoading(false));
  }, [toast]);

  const fetchShopHistory = useCallback(() => {
    if (shopHistories) {
      // fix me
    }
    if (user) {
      UserApi.getShopHistory(user?.id)
        .then((res) => setShopHistories(res.history))
        .catch((err) => console.log(err));
    }
  }, [shopHistories, user]);

  const filterOrderByStatus = useCallback(
    (orderStatus: OrderTab) => {
      return allOrders.filter(({ status }) => {
        switch (orderStatus) {
          case OrderTab.Processing: {
            return status === OrderStatus.Created;
          }

          case OrderTab.Delivered: {
            return status === OrderStatus.Processed;
          }

          case OrderTab.Cancelled: {
            return status === OrderStatus.Cancelled;
          }

          default:
            return false;
        }
      });
    },
    [allOrders]
  );

  const ordersByStatus = useMemo(() => {
    return defaultOrdersByStatus.map((order) => ({
      ...order,
      count: filterOrderByStatus(order.status).length
    }));
  }, [filterOrderByStatus]);

  const addQueryParams = (type: string) => {
    return history.push({
      pathname: `/profile/dashboard`,
      search: `?type=${type}`
    });
  };

  const handleClickOrderByStatus = (tab: OrderTab) => {
    setVisibleOrders(true);
    setActiveTab(tab);
    addQueryParams(tab);
  };

  const handleTabClick = (tab: OrderTab) => {
    setActiveTab(tab);
    addQueryParams(tab);
  };

  const handleDeleteMessage = (id: string) => {
    UserApi.removeMessage(id)
      .then(() => {
        const updatedMessages = messages.filter((m) => m.id !== id);
        setMessages([...updatedMessages]);
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={t('Message.Message is removed successfully')} onClose={onClose} />
        });
      })
      .catch((err) => {
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
        });
      });
  };

  const handleOpenOrderDetailModal = (id: string) => {
    history.push(ROUTES.ORDERS.DETAIL.replace(':id', id));
  };

  useEffect(() => {
    const newOrders = filterOrderByStatus(activeTab);
    setOrders(newOrders);
  }, [allOrders, activeTab, filterOrderByStatus]);

  useEffect(() => {
    if (user) {
      fetchShopHistory();
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    if (state && state.tab) {
      setVisibleOrders(true);
      if (state?.tab === OrderTab.Processing) {
        setActiveTab(OrderTab.Processing);
      }
      if (state?.tab === OrderTab.Delivered) {
        setActiveTab(OrderTab.Delivered);
      }
      if (state?.tab === OrderTab.Cancelled) {
        setActiveTab(OrderTab.Cancelled);
      }
    } else {
      setVisibleOrders(false);
    }
  }, [state]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (typeParam) {
      setActiveTab(typeParam as OrderTab);
      setVisibleOrders(true);
    }
  }, [typeParam]);

  TabTitle('Dashboard - Digital Music Shopping Market Place');
  metaTagByTitle('Dashboard - Digital Music Shopping Market Place');
  metaTagByDesc(
    'Music-Store is founded on values we all share and are ready to stand for. They bring us together well beyond our current products and technologies. They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  return (
    <>
      <div className="profile-dashboard-tab">
        <hr className="divider" />
        {visibleOrders ? (
          <div className="orders-wrapper">
            <div className="orders-tab">
              {ordersByStatus.map(({ status, count }, index) => (
                <div
                  key={index}
                  className={classnames('order-tab', { active: status === activeTab })}
                  onClick={() => handleTabClick(status as OrderTab)}
                >
                  <span className="text-body2 order-status">{t(`Profile.${status}`)}</span>
                  <span className="text-body2 order-count">{count}</span>
                </div>
              ))}
            </div>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*  @ts-ignore*/}
            <PerfectScrollbar className="orders">
              {orders && orders.length > 0 ? (
                orders.map(({ _id, totalPrice, discount, createdAt, orderItems, vat, taxamoInvoiceNumber }) => (
                  <div key={_id} className="order">
                    <div className="order-delete">
                      <IconButton icon="remove" />
                    </div>
                    <div className="text-heading4 text--lime order-total-price">
                      ${getDiscount(totalPrice, discount as number, { tax_amount: vat })}
                    </div>
                    <div className="order-code">
                      <span className="text-body2">Order Code:</span>
                      <span className="text-body2">{taxamoInvoiceNumber}</span>
                    </div>
                    <div className="text-body2 order-date">{moment(createdAt).format('DD MMM YYYY')}</div>
                    <div className="order-items">
                      {orderItems
                        ?.filter((_, index) => index < 4)
                        .map(({ id, thumbnail }) => (
                          <img
                            key={id}
                            src={`${REACT_APP_API_ASSET_SERVER}/${thumbnail.fieldname}/${thumbnail.filename}`}
                            alt={thumbnail.filename}
                          />
                        ))}
                      {orderItems && orderItems?.length > 4 && (
                        <span className="text-body2">+ {orderItems?.length - 4}</span>
                      )}
                    </div>
                    <div className="order-next">
                      <IconButton icon="arrow-right" onClick={() => handleOpenOrderDetailModal(_id as string)} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-orders">
                  <img src="/images/empty/order.svg" alt="no-order" />
                </div>
              )}
            </PerfectScrollbar>
          </div>
        ) : (
          <>
            <AnimationOnScroll animation="animate__fadeIn" isSubElement delay={1} className="my-orders-wrapper">
              <p className="text-heading4 my-orders-title">{t('Layout.My Orders')}</p>
              <div className="my-orders">
                {ordersByStatus.map(({ status, icon, count }, index) => (
                  <div key={index} className="my-order" onClick={() => handleClickOrderByStatus(status as OrderTab)}>
                    <div className="order-icon">
                      <Icon name={icon as IIcon} />
                    </div>
                    <span className="text-body1 order-status">{t(`Profile.${status}`)}</span>
                    <span className="text-body1 text--lime order-count">{count}</span>
                  </div>
                ))}
              </div>
            </AnimationOnScroll>
            <AnimationOnScroll animation="animate__fadeIn" isSubElement delay={2} className="recent-messages">
              <p className="text-heading4 recent-message-title">{t('Common.Messages')}</p>
              {loading ? (
                <Flex justifyContent="center" alignItems="center" height={200}>
                  <Spinner color="#00Ff00" size="xl" />
                </Flex>
              ) : (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                <PerfectScrollbar className="messages">
                  {messages?.map((message) => (
                    <div key={message.id} className="message">
                      <div className="message-content">
                        <p className="text-body2">{message.content}</p>
                        <IconButton
                          icon="trash-outline"
                          className="delete-icon"
                          onClick={() => handleDeleteMessage(message.id)}
                        />
                      </div>
                      <div className="message-time">
                        <hr />
                        <p className="text-body3">{formatDate(message.updatedAt)}</p>
                      </div>
                    </div>
                  ))}
                </PerfectScrollbar>
              )}
            </AnimationOnScroll>
          </>
        )}
        {/*<div className="analytic-chart-area">*/}
        {/*  {shopHistory.length > 0 ? <Chart data={shopHistory} /> : <p className="text-body1">There is no history</p>}*/}
        {/*</div>*/}
      </div>
    </>
  );
};
