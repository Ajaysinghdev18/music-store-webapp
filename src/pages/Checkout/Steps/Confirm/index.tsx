// Dependencies
import React, { FC, useState } from 'react';
import { Button, useToast } from '@chakra-ui/core';
import { useDispatch, useSelector } from 'react-redux';

// Apis
import { BalanceApi, OrderApi, StripeApi, TransactionApi } from '../../../../apis';

// Store
import { addToCart, createOrder, setBalances, setTransactions } from '../../../../store/actions';
import { getCart, getUser } from '../../../../store/selectors';

// Interfaces
import { IOrder, OrderStatus, OrderStatusType } from '../../../../shared/interfaces';
import { PaymentMethod } from '../..';
import { v4 as uuidv4 } from 'uuid';
import { Alert } from '../../../../components';
import { getDiscount } from '../../../Cart';

interface IConfirmStepProps {
  tax: any;
  formData: any;
  goToNextStep: () => void;
  paymentMethod: string;
  currency: string;
  totalAmountInCrypto: any;
}

// Export Confirm step
export const ConfirmStep: FC<IConfirmStepProps> = ({
  tax,
  formData,
  goToNextStep,
  paymentMethod,
  totalAmountInCrypto,
  currency
}) => {
  // States
  const [isPaying, setIsPaying] = useState(false);

  // Get dispatch from hook
  const dispatch = useDispatch();

  const toast = useToast();

  // Get cart from store
  const cart = useSelector(getCart);
  console.log("🚀 ~ file: index.tsx:48 ~ cart:", cart)

  // Get user from store
  const user = useSelector(getUser);

  const setUserBalances = () => {
    BalanceApi.getBalance({
      options: {
        id: user?.id
      }
    })
      .then((res) => {
        dispatch(setBalances(res.balance));
      })
      .catch((err) => {
        dispatch(setBalances({}));
        console.log(err);
      });
  };

  const setUserTransactions = () => {
    TransactionApi.gettransactions({
      query: {
        userId: user?.id
      },
      options: {
        limit: 5
      }
    })
      .then((res) => {
        console.log(res);
        dispatch(setTransactions(res.transactions));
      })
      .catch((err) => {
        dispatch(setTransactions([]));
        console.log(err);
      });
  };

  //Pay handler
  const handlePay = async () => {
    setIsPaying(true);
    const referenceId = uuidv4();
    const res = await OrderApi.getIpv4();
    const data: IOrder = {
      totalPrice: cart?.total,
      discount: cart?.discount as number,
      products: cart?.products,
      userId: cart?.userId,
      buyerIpAddress: res.data.ip,
      name: user?.name,
      ...formData,
      clientReferenceId: referenceId
    };

    OrderApi.order(data)
      .then((res) => {
        // return;
        dispatch(createOrder(res));
        const transaction_lines = res.orderItems.map((item: any) => {
          return {
            unit_price: item.price,
            description: item.productName,
            total_amount: item.price,
          }
        })
        OrderApi.updateOrder(res.orderId, { transaction_lines })
        if (res.success) {
          if (formData.paymentMethod === PaymentMethod.Card) {
            // axios.get('https://ipapi.co/currency/')
            //   .then((response) => {
            //     // Get Taxamo instance from global api
            //     const { Taxamo } = window;
            //     // Checkout must be initialized with your public API key
            //     Taxamo.initialize(process.env.REACT_APP_TAXAMO_PUBLIC_API);
            //     console.log("🚀 ~ file: index.tsx:117 ~ consttransaction_lines=res.orderItems.map ~ transaction_lines:", transaction_lines)
            //     const transaction = {
            //       currency_code: currency === "€" ? 'EUR' : 'USD',
            //       transaction_lines: transaction_lines,
            //     };
            //     const metadata = {};
            //     const checkout = new Taxamo.Checkout(transaction, metadata);
            //     checkout.overlay(function (data: any) {
            //       if (data?.success) {
            //         console.log("res.orderId", res.orderId)
            //         const object: OrderStatusType = {
            //           orderId: res.orderId,
            //           status: OrderStatus.Processed,
            //           paidAt: Date.now(),
            //           // transaction_lines
            //         };
            //         OrderApi.updateOrderStatus(object)
            //           .then(() => {
            //             setIsPaying(false);
            //             goToNextStep();
            //           })
            //           .catch((err) => {
            //             console.log(err);
            //             alert('Internal Server Error');
            //           });
            //       } else {
            //         console.log("res.orderId", res.orderId)
            //         const object: OrderStatusType = {
            //           orderId: res.orderId,
            //           status: OrderStatus.Cancelled,
            //           paidAt: Date.now(),
            //           // taxamoId: taxamoId
            //         };
            //         OrderApi.updateOrderStatus(object)
            //           .then(() => {
            //             setIsPaying(false);
            //           })
            //           .catch((err) => {
            //             console.log(err);
            //             alert('Internal Server Error');
            //           });
            //       }
            //     });
            //   })
            //   .catch((err) => console.log(err));
            const data = {
              email: user?.email,
              items: res.orderItems,
              currency: currency === "€" ? 'EUR' : 'USD',
              clientReferenceId: referenceId
            }
            OrderApi.createSession(data)
              .then((res) => {
                console.log("res", res)
                window.location.href = res.url;
              })
              .catch((err) => {
                console.log("🚀 ~ file: index.tsx:176 ~ .then ~ err:", err)

              })
          }
          else if (formData.paymentMethod === PaymentMethod.CryptoCurrency) {
            if (user) {
              setUserBalances();
              setUserTransactions();
            }
            dispatch(addToCart(null));
            goToNextStep();
          }
          // else if (formData.paymentMethod === PaymentMethod.Paypal) {
          // }
          //   checkout.redirect();
        }
      })
      .catch((err) => {
        setIsPaying(false);
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={err.error.shortMessage} color="red" onClose={onClose} />
        });
        console.log(err);
      });
  };

  // Return Confirm step
  return (
    <div className="confirm-section">
      <h3 className="text-heading3 text--lime">All set!</h3>
      <h3 className="text-heading3">Do you confirm this Payment?</h3>
      <div className="total-price">
        <h3 className="text-heading3">Total: </h3>
        {PaymentMethod.CryptoCurrency === paymentMethod ? (
          <h3 className="text-heading3 text--lime">
            {currency} {totalAmountInCrypto.unit}{' '}
            {`(${currency}${tax?.total_amount ? tax.total_amount : 0})`}
          </h3>
        ) : (
          <h3 className="text-heading3 text--lime">
            {currency}
            {tax?.total_amount ? tax.total_amount : 0}
          </h3>
        )}
      </div>
      <Button isLoading={isPaying} className="d-button pay-button" onClick={handlePay}>
        Confirm & Pay
      </Button>
    </div>
  );
};
