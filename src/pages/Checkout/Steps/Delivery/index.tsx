import React, { FC, MutableRefObject, useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Checkbox, FormControl, FormHelperText, Input } from '@chakra-ui/core';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';

// Selector
import { getUser, getUserWallets } from '../../../../store/selectors';

// Interfaces
import { CheckoutStep } from '../../index';
import { CartModel } from '../../../../shared/models/cart.model';

interface IDeliveryStepProps {
  formClass: (step: CheckoutStep) => string;
  submitRef: MutableRefObject<HTMLButtonElement | null>;
  handleSubmit: (values: any) => void;
  cart: CartModel | null;
}


// Export Delivery step
export const DeliveryStep: FC<IDeliveryStepProps> = ({ submitRef, formClass, cart, handleSubmit }) => {
  // Get user from store
  const user = useSelector(getUser);
  const wallets = useSelector(getUserWallets);
  const [initialValues, setInitialValues] = useState({
    email: user?.email,
    note: '',
    isGift: false,
    ethereumWalletKey: '',
    casperWalletKey: ''
  })
  const [csprWalletAddress, setCsprWalletAddress] = useState([])
  const [ethereumWalletAddress, setEthereumAddress] = useState([])
  const [isCustomEthAddress, setCustomEthAddress] = useState<boolean>(false)
  const [isCustomCsprAddress, setCustomCsprAddress] = useState<boolean>(false)
  const [EthFlag, setEthFlag] = useState<boolean>(false)
  const [CSPRFlag, setCsprFlag] = useState<boolean>(false)


  const ethAddresses: any = [];
  const csprAddresses: any = [];
  useEffect(() => {
    if (wallets.length > 0) {
      wallets.forEach((wallet) => {
        if (wallet.chain === 'CSPR') {
          csprAddresses.push(wallet.address)
        } else {
          ethAddresses.push(wallet.address)
        }
      })
    }
    setCsprWalletAddress(csprAddresses);
    setEthereumAddress(ethAddresses);
  }, [wallets])

  useEffect(() => {
    if (cart && cart.products && cart.products.length > 0) {
      setEthFlag(cart.products.some(({ chain }) => chain === 'ETH'));
      setCsprFlag(cart.products.some(({ chain }) => chain === 'CSPR'));
    }
  }, [cart])

  useEffect(() => {
    if (user) {
      setInitialValues({ ...initialValues, email: user?.email })
    }

    if (EthFlag) {
      setInitialValues({
        ...initialValues,
        ethereumWalletKey: ethereumWalletAddress[0],
      })
    }
    if (CSPRFlag) {
      setInitialValues({
        ...initialValues,
        casperWalletKey: csprWalletAddress[0],
      })
    }

  }, [ethereumWalletAddress, csprWalletAddress, cart, user, EthFlag, CSPRFlag])



  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is not valid!').required('Email is required!'),
    ethereumWalletKey: EthFlag ? Yup.string().required('Eth key is required!') : Yup.string(),
    casperWalletKey: CSPRFlag ? Yup.string().required('Cspr key is required!') : Yup.string()
  });
  // Return Delivery step
  return (
    <div className={formClass(CheckoutStep.Delivery)}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => {

          return (
            <Form onSubmit={handleSubmit}>
              <FormControl className="d-form-control" isInvalid={Boolean(errors.email && touched.email)}>
                <Input
                  className="d-form-input"
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormHelperText className="d-form-helper-text">
                  {Boolean(errors.email && touched.email) && String(errors.email)}
                </FormHelperText>
              </FormControl>
              <FormControl className="d-form-control" isInvalid={Boolean(errors.isGift && touched.isGift)}>
                <Checkbox className="d-checkbox" name="isGift" isChecked={values.isGift} onChange={handleChange}>
                  Send as a Gift
                </Checkbox>
                <FormHelperText className="d-form-helper-text">
                  {Boolean(errors.isGift && touched.isGift) && String(errors.isGift)}
                </FormHelperText>
              </FormControl>
              <FormControl className="d-form-control" isInvalid={Boolean(errors.note && touched.note)}>
                <Input
                  className="d-form-input"
                  placeholder="Enter your message here"
                  name="note"
                  value={values.note}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormHelperText className="d-form-helper-text">
                  {Boolean(errors.note && touched.note) && String(errors.note)}
                </FormHelperText>
              </FormControl>
              {/* <FormControl className="d-form-control" isInvalid={Boolean(errors.note && touched.note)}>
              <Input
                className="d-form-input"
                placeholder="Enter your public key"
                name="publicKey"
                value={values.publicKey}
                onChange={handleChange}
                onBlur={handleBlur}
                isDisabled={user?.accountWallet ? true : false}
              />
              <FormHelperText className="d-form-helper-text">
                {Boolean(errors.publicKey && touched.publicKey) && String(errors.publicKey)}
              </FormHelperText>
            </FormControl> */}
              {EthFlag && <FormControl className="d-form-control" isInvalid={Boolean(errors.note && touched.note)}>
                {isCustomEthAddress && <Input
                  className="d-form-input"
                  placeholder="Enter your eth key"
                  name="ethereumWalletKey"
                  value={values.ethereumWalletKey}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />}

                {!isCustomEthAddress && <Field className='d-form-input' as="select" name="ethereumWalletKey" onChange={(e: any) => {
                  if (e.target.value === 'custom') {
                    setCustomEthAddress(!isCustomEthAddress);
                    setFieldValue('ethereumWalletKey', '')
                  } else {
                    setFieldValue('ethereumWalletKey', e.target.value)
                  }
                }}>
                  <option value=''>Select Eth Address</option>
                  {ethereumWalletAddress?.map((address: any) => {
                    return (
                      <option value={address}>{address}</option>
                    )
                  })}
                  <option value='custom'>Custom...</option>
                </Field>}
                <FormHelperText className="d-form-helper-text">
                  {Boolean(errors.ethereumWalletKey && touched.ethereumWalletKey) && String(errors.ethereumWalletKey)}
                </FormHelperText>
              </FormControl>}
              {CSPRFlag && <FormControl className="d-form-control" isInvalid={Boolean(errors.note && touched.note)}>
                {isCustomCsprAddress && <Input
                  className="d-form-input"
                  placeholder="Enter your casper key"
                  name="casperWalletKey"
                  value={values.casperWalletKey}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />}

                {!isCustomCsprAddress && <Field className='d-form-input' as="select" name="casperWalletKey" onChange={(e: any) => {
                  if (e.target.value === 'custom') {
                    setCustomCsprAddress(!isCustomCsprAddress);
                    setFieldValue('casperWalletKey', '')
                  } else {
                    setFieldValue('casperWalletKey', e.target.value)
                  }
                }}>
                  <option value=''>Select Cspr Address</option>
                  {csprWalletAddress?.map((address: any) => {
                    return (
                      <option value={address}>{address}</option>
                    )
                  })}
                  <option value='custom'>Custom...</option>
                </Field>}

                <FormHelperText className="d-form-helper-text">
                  {Boolean(errors.casperWalletKey && touched.casperWalletKey) && String(errors.casperWalletKey)}
                </FormHelperText>
              </FormControl>}

              <button type="submit" ref={submitRef} />
            </Form>
          )
        }}
      </Formik>
    </div >
  );
};

