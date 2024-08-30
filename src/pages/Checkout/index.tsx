// Dependencies
import { Button } from '@chakra-ui/core';
import classnames from 'classnames';
import { t } from 'i18next';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

// Apis
import { OrderApi, WalletApi } from '../../apis';
// Components
import { AddCardModal, AnimationOnScroll, QrCodeModal, Step, Stepper } from '../../components';
// Constants
import { ROUTES } from '../../constants';
import { addUserWallets } from '../../store/actions';
// Store
import { getCart } from '../../store/selectors';
import { validateCurrency } from '../../utils';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
import { getDiscount } from '../Cart';
// Steps
import { ConfirmStep, DeliveryStep, DoneStep, PaymentStep, ProfileStep } from './Steps';
// Styles
import './styles.scss';

// Declare type
declare global {
  interface Window {
    Taxamo?: any;
  }
}

// Interfaces
export enum CheckoutStep {
  Profile,
  Delivery,
  Payment,
  Confirm,
  Done
}

export enum PaymentMethod {
  Paypal = 'paypal',
  Card = 'credit',
  CryptoCurrency = 'crypto-currency'
}

export interface TotalCrypto {
  amount: number;
  unit: string;
}

// Export checkout page
export const CheckoutPage: FC = () => {
  // States
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.Profile);
  const [formData, setFormData] = useState<any>({});
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Paypal);
  const [tax, setTax] = useState<any>();
  const [ipAddress, setIpAddress] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [visibleAddCardModal, setVisibleAddCardModal] = useState<boolean>(false);
  const [visibleQrCodeModal, setVisibleQrCodeModal] = useState(false);
  const [totalAmountInCrypto, setTotalAmountInCrypto] = useState<TotalCrypto>({ amount: 0, unit: '' });
  // Create submit refs
  const submitRefs = [
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null)
  ];

  // Get history from hook
  const history = useHistory();

  // Get cart from store
  const cart = useSelector(getCart);

  // Next handler
  const handleNext = () => {
    submitRefs[currentStep].current?.click();
  };

  // Step change handler
  const handleStepChange = (step: CheckoutStep) => {
    setCurrentStep(step);
  };

  // Create form class
  const formClass = (step: CheckoutStep) =>
    classnames('form-wrapper', {
      completed: currentStep > step,
      disabled: currentStep < step
    });

  // Move to next step
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Move to prev step
  const goToPrevStep = () => {
    if (currentStep === CheckoutStep.Profile) {
      history.push(ROUTES.CART);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit handler
  const handleSubmit = (values: any) => {
    setFormData({ ...formData, ...values });
    goToNextStep();
  };

  // Open add card modal handler
  const handleOpenAddCardModal = () => {
    setVisibleAddCardModal(true);
  };

  // Close add card modal handler
  const handleCloseAddCardModal = () => {
    setVisibleAddCardModal(false);
  };

  // Open qr code modal
  const handleOpenQrCodeModal = () => {
    setVisibleQrCodeModal(true);
  };

  // Close qr code modal
  const handleCloseQrCodeModal = () => {
    setVisibleQrCodeModal(false);
  };
  // Handle crypto total amount
  const handleTotalCryptoAmount = (amount: number, unit: string) => {
    setTotalAmountInCrypto({ amount, unit });
  };

  // On mounted
  useEffect(() => {
    OrderApi.getIpv4()
      .then((res) => setIpAddress(res.data.ip))
      .catch((err) => console.log(err));
    WalletApi.readAll()
      .then((res) => {
        dispatch(addUserWallets(res.wallets));
      })
      .catch((err) => {
        console.log('🚀 ~ file: index.tsx:151 ~ useEffect ~ err:', err);
      });
  }, [dispatch]);

  // On cart changed
  useEffect(() => {
    if (cart && ipAddress) {
      OrderApi.getVat({
        amountToBePaid: getDiscount(cart?.total, cart?.discount as number, tax) as any,
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

  TabTitle(` Check Out - Digital Music Shopping Market Place`);
  metaTagByTitle(`Check Out - Digital Music Shopping Market Place`);
  metaTagByDesc(
    'Music-Store is founded on values we all share and are ready to stand for. They bring us together well beyond our current products and technologies. They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);
  // Return checkout page
  return (
    <div className="checkout-page">
      <AnimationOnScroll animation="animate__bounce" delay={2}>
        <div className="page-title">
          <h2 className="text-heading2">{t('Checkout.Check Out')}</h2>
        </div>
      </AnimationOnScroll>
      <div className="content">
        <Stepper activeStep={currentStep} onChange={handleStepChange}>
          <Step stepNum={CheckoutStep.Profile}>{t('Checkout.Profile')}</Step>
          <Step stepNum={CheckoutStep.Delivery}>{t('Checkout.Delivery')}</Step>
          <Step stepNum={CheckoutStep.Payment}>{t('Checkout.Payment')}</Step>
          <Step stepNum={CheckoutStep.Confirm}>{t('Checkout.Confirm')}</Step>
        </Stepper>
        <div
          className={classnames('checkout-forms', {
            visible: currentStep < CheckoutStep.Confirm
          })}
        >
          <ProfileStep formClass={formClass} submitRef={submitRefs[CheckoutStep.Profile]} handleSubmit={handleSubmit} />
          <DeliveryStep
            formClass={formClass}
            submitRef={submitRefs[CheckoutStep.Delivery]}
            handleSubmit={handleSubmit}
            cart={cart}
          />
          <PaymentStep
            tax={tax}
            formClass={formClass}
            submitRef={submitRefs[CheckoutStep.Payment]}
            handleSubmit={handleSubmit}
            handleOpenAddCardModal={handleOpenAddCardModal}
            handleOpenQrCodeModal={handleOpenQrCodeModal}
            setPaymentMethod={setPaymentMethod}
            paymentMethod={paymentMethod}
            currency={currency}
            handleTotalCryptoAmount={(amount: number, unit: string) => handleTotalCryptoAmount(amount, unit)}
          />
        </div>
        {currentStep === CheckoutStep.Confirm && (
          <ConfirmStep
            tax={tax}
            formData={formData}
            goToNextStep={goToNextStep}
            paymentMethod={paymentMethod}
            totalAmountInCrypto={totalAmountInCrypto}
            currency={currency}
          />
        )}
        {currentStep === CheckoutStep.Done && <DoneStep />}
        <div className="actions">
          {currentStep < CheckoutStep.Done && (
            <Button className="d-button" onClick={goToPrevStep}>
              BACK
            </Button>
          )}
          {currentStep < CheckoutStep.Confirm &&
            (currentStep === CheckoutStep.Payment ? (
              paymentMethod === PaymentMethod.Paypal ? (
                <Button className="d-button" isDisabled>
                  Check out with PayPal
                </Button>
              ) : (
                <Button className="d-button" onClick={handleNext}>
                  NEXT
                </Button>
              )
            ) : (
              <Button className="d-button" onClick={handleNext}>
                NEXT
              </Button>
            ))}
        </div>
      </div>
      <QrCodeModal open={visibleQrCodeModal} onClose={handleCloseQrCodeModal} />
      <AddCardModal open={visibleAddCardModal} onClose={handleCloseAddCardModal} onSubmit={handleSubmit} />
    </div>
  );
};
