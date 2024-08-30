// Dependencies
import React, { FC, MutableRefObject, useCallback, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { FormControl, Radio, RadioGroup } from '@chakra-ui/core';
import classnames from 'classnames';
import { useSelector } from 'react-redux';

// Components
import { PrepaidCrypto } from './PrepaidCrypto';
import { Icon, IIcon } from '../../../../components';

// Styles
import './styles.scss';

// Interfaces
import { CheckoutStep, PaymentMethod } from '../../index';
import { getBalances } from '../../../../store/selectors';
import { DirectPayment } from './DirectPayment';

interface IPaymentStepProps {
  tax: any;
  formClass: (step: CheckoutStep) => string;
  submitRef: MutableRefObject<HTMLButtonElement | null>;
  handleSubmit: (values: any) => void;
  handleOpenAddCardModal: () => void;
  handleOpenQrCodeModal: () => void;
  handleTotalCryptoAmount: (amount: number, unit: string) => void;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
  paymentMethod: string;
  currency: string;
}

interface IPrepaidCrypto {
  icon: IIcon;
  value: number;
  label: string;
  unit: string;
  rate: number;
  coins: number;
}

// Constants
enum CryptoMode {
  Prepaid = 'prepaid',
  Direct = 'direct'
}

const allCryptoOptions: IPrepaidCrypto[] = [
  {
    icon: 'ethereum',
    value: 0,
    label: 'Ethereum',
    unit: 'ETH',
    rate: 0,
    coins: 0
  },
  {
    icon: 'casper',
    value: 0,
    label: 'Casper',
    unit: 'CSPR',
    rate: 0,
    coins: 0
  },
];

// Export Payment step
export const PaymentStep: FC<IPaymentStepProps> = ({
  tax,
  submitRef,
  formClass,
  handleSubmit,
  setPaymentMethod,
  handleTotalCryptoAmount,
  currency
}) => {
  // States
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string[]>([]);
  const [cryptoOptions, setCryptoOptions] = useState<IPrepaidCrypto[]>([]);

  const [cryptoMode, setCryptoMode] = useState<CryptoMode>(CryptoMode.Prepaid);

  // Get balance from store
  const balances = useSelector(getBalances);

  // Toggle coin select handler
  const handleToggleCoinSelect = () => {
    setOpenSelect(!openSelect);
  };

  // Change crypto mode handler
  const handleChangeCryptoMode = (value: CryptoMode) => {
    setCryptoMode(value);
  };

  const getCryptoOptions = useCallback(() => {
    const cryptos: IPrepaidCrypto[] = [];
    let cryptoWithHighestBalance: IPrepaidCrypto | undefined;
    balances.forEach((balance) => {
      const crypto: IPrepaidCrypto | undefined = allCryptoOptions.find((crypto) => crypto.unit === balance.unit);
      if (crypto) {
        cryptos.push({
          ...crypto,
          value: balance.toUsd,
          rate: balance?.rate,
          coins: balance.coins
        });
        if (!cryptoWithHighestBalance || cryptoWithHighestBalance?.value < balance.toUsd) {
          if (balance.toUsd >= tax?.total_amount) {
            cryptoWithHighestBalance = {
              ...crypto,
              value: balance.toUsd,
              rate: balance?.rate,
              coins: balance.coins
            };
          }
        }
      }
    });
    setCryptoOptions(cryptos);
    // if (cryptoWithHighestBalance?.unit){} setSelectedCrypto([cryptoWithHighestBalance?.unit]);
  }, [balances, tax]);
  useEffect(() => {
    if (balances) {
      getCryptoOptions();
    }
  }, [balances, getCryptoOptions]);

  const onSelectCrypto = (option: IPrepaidCrypto, add = false) => {
    console.log('🚀 ~ file: index.tsx ~ line 164 ~ onSelectCrypto ~ option', option);
    handleTotalCryptoAmount(+(tax?.total_amount / option.rate).toFixed(4), option.unit);
    if (option.value > 0) {
      if (add) {
        const newSelectedCrypto = selectedCrypto.filter((crypto) => crypto !== option.unit);
        newSelectedCrypto.splice(0, 1);
        newSelectedCrypto.push(option.unit);
        setSelectedCrypto(newSelectedCrypto);
      }
    }
  };

  const onSubmitHandler = (values: any) => {
    if (values.paymentMethod === PaymentMethod.CryptoCurrency) {
      const totalCryptoBalance: number = cryptoOptions
        .filter((crypto) => selectedCrypto.includes(crypto.unit))
        .map((crypto) => crypto.value)
        .reduce((total, value) => total + value);
      if (totalCryptoBalance >= tax?.total_amount) {
        handleSubmit({
          ...values,
          crypto: selectedCrypto
        });
      }
    } else {
      handleSubmit(values);
    }
  };

  // Return Payment step
  return (
    <div className={classnames('payment-step', formClass(CheckoutStep.Payment))}>
      <Formik
        initialValues={{
          paymentMethod: 'paypal'
        }}
        onSubmit={onSubmitHandler}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <FormControl className="d-form-control payment-form-container">
              <RadioGroup
                name="paymentMethod"
                value={values.paymentMethod}
                className="d-radio-group"
                onChange={handleChange}
              >
                <Radio
                  className="d-radio"
                  value={PaymentMethod.Paypal}
                  onClick={() => setPaymentMethod(PaymentMethod.Paypal)}
                >
                  <Icon name="paypal" color={values.paymentMethod === PaymentMethod.Paypal ? 'lime' : 'white'} />
                  PayPal
                </Radio>
                {values.paymentMethod === PaymentMethod.Paypal && (
                  <label className="text-body1 text--semibold payment-label">
                    By Using your PayPal account, you can make payments securely.
                  </label>
                )}
                <Radio
                  className="d-radio"
                  value={PaymentMethod.Card}
                  onClick={() => setPaymentMethod(PaymentMethod.Card)}
                >
                  <Icon
                    name="payment"
                    color={values.paymentMethod === PaymentMethod.Card ? 'lime' : 'white'}
                    width={'1.5rem'}
                    fill="white"
                  />
                  Credit / Debit Card
                </Radio>
                {/*{values.paymentMethod === PaymentMethod.Card && (*/}
                {/*  <Button*/}
                {/*    className="d-outlined-button d-button--full-width add-card-button"*/}
                {/*    leftIcon={() => <Icon name="payment" />}*/}
                {/*    onClick={handleOpenAddCardModal}*/}
                {/*  >*/}
                {/*    Add a credit card*/}
                {/*  </Button>*/}
                {/*)}*/}
                <Radio
                  className="d-radio"
                  value={PaymentMethod.CryptoCurrency}
                  onClick={() => setPaymentMethod(PaymentMethod.CryptoCurrency)}
                >
                  <Icon
                    name="crypto"
                    color={values.paymentMethod === PaymentMethod.CryptoCurrency ? 'lime' : 'white'}
                  />
                  Crypto Currency
                </Radio>
              </RadioGroup>
            </FormControl>
            {values.paymentMethod === PaymentMethod.CryptoCurrency && (
              <div className="crypto-currency">
                <div className="crypto-currency-line" />
                {/*<label className="text-body2 text--semibold payment-label">Please send to address</label>*/}
                {/*<div className="payment-address-wrapper">*/}
                {/*  <Link className="payment-address">*/}
                {/*    <span className="text-body2 text--semibold text--lime">Endss8436sf4s6686d6f8FDhsD4s6f4f6s</span>*/}
                {/*    <Icon name="copy" />*/}
                {/*  </Link>*/}
                {/*  <IconButton icon="qr" onClick={handleOpenQrCodeModal} />*/}
                {/*</div>*/}
                <Radio
                  isChecked={cryptoMode === CryptoMode.Prepaid}
                  onClick={() => handleChangeCryptoMode(CryptoMode.Prepaid)}
                  className="d-radio d-radio--small"
                >
                  Prepaid Balance Payment
                </Radio>
                <div className="selected-crypto">
                  {cryptoOptions
                    .filter((crypto) => selectedCrypto.includes(crypto.unit))
                    .map((crypto, index) => (
                      <PrepaidCrypto
                        key={index}
                        selected
                        {...crypto}
                        endIcon="check"
                        onClick={() => onSelectCrypto(crypto)}
                      />
                    ))}
                </div>
                <div className="crypto-select">
                  <PrepaidCrypto
                    icon="bx-coin"
                    coins={0}
                    toggleOption
                    label="Add other Prepaid Crypto"
                    endIcon={openSelect ? 'arrow-up' : 'arrow-down'}
                    onClick={handleToggleCoinSelect}
                  />
                  {openSelect && (
                    <div className="crypto-options">
                      {cryptoOptions
                        .filter((crypto) => !selectedCrypto.includes(crypto.unit))
                        .map((option, index) => (
                          <PrepaidCrypto
                            key={index}
                            {...option}
                            endIcon="plus"
                            onClick={() => onSelectCrypto(option, true)}
                          />
                        ))}
                    </div>
                  )}
                </div>
                <Radio
                  className="d-radio d-radio--small"
                  isChecked={cryptoMode === CryptoMode.Direct}
                  onClick={() => handleChangeCryptoMode(CryptoMode.Direct)}
                >
                  Direct Payment
                </Radio>
              </div>
            )}
            <button type="submit" ref={submitRef} />
          </Form>
        )}
      </Formik>
      <div className="payment-bill-wrapper">
        <h3 className="text-heading3">Total: </h3>
        <div className="payment-bill">
          <h3 className="text-heading3 text--lime">
            {currency}
            {tax?.total_amount ? tax.total_amount : 0}
          </h3>
          {cryptoOptions.map((item, index) => {
            return (
              <div key={index} className="bill-item">
                <Icon name={item.icon} className="d-icon" />
                <h4 className="text-heading4">{(tax?.total_amount / item.rate).toFixed(4)} {item.unit}</h4>
              </div>
            )
          })}
          {/*<div className="bill-item">*/}
          {/*  <Icon name="casper" />*/}
          {/*  <h4 className="text-heading4">{(tax?.total_amount / crypto.rate).toFixed(4)}</h4>*/}
          {/*</div>*/}
        </div>
      </div>
      {cryptoMode === CryptoMode.Direct && <DirectPayment onClose={() => handleChangeCryptoMode(CryptoMode.Prepaid)} />}
    </div>
  );
};
