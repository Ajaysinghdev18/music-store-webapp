import React, { FC } from 'react';
import { IconButton } from '../IconButton';
import { Form, Formik } from 'formik';
import { Button, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/core';
import * as Yup from 'yup';

// Components
import { Icon } from '../Icon';
import { Select } from '../Select';
import { COUNTRIES } from '../../constants/countries';

// Styles
import './styles.scss';

// Interfaces
interface IAddCardModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required!'),
  cardNumber: Yup.string()
    .required()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(16, 'Must be exactly 16 digits')
    .max(16, 'Must be exactly 16 digits'),
  postalCode: Yup.string()
    .required('Postal code is required!')
    .matches(/^[0-9]+$/, 'Must be only digits'),
  country: Yup.string().required('Country is required!'),
  expiry: Yup.string()
    .typeError('Not a valid expiration date. Example: MM/YY')
    .max(5, 'Not a valid expiration date. Example: MM/YY')
    .matches(/([0-9]{2})\/([0-9]{2})/, 'Not a valid expiration date. Example: MM/YY')
    .test('test-credit-card-expiration-date', 'Invalid Expiration Date has past', (expirationDate) => {
      if (!expirationDate) {
        return false;
      }

      const today = new Date();
      const monthToday = today.getMonth() + 1;
      const yearToday = today.getFullYear().toString().substr(-2);

      const [expMonth, expYear] = expirationDate.split('/');

      if (Number(expYear) < Number(yearToday)) {
        return false;
      } else if (Number(expMonth) < monthToday && Number(expYear) <= Number(yearToday)) {
        return false;
      }

      return true;
    })
    .test('test-credit-card-expiration-date', 'Invalid Expiration Month', (expirationDate) => {
      if (!expirationDate) {
        return false;
      }
      // const today = new Date().getFullYear().toString().substr(-2);

      const [expMonth] = expirationDate.split('/');

      return Number(expMonth) <= 12;


    })
    .required('Expiration date is required'),
  cvv: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(3, 'Must be 3 digits')
    .max(4, ' Must be 4 Digits')
});

export const AddCardModal: FC<IAddCardModalProps> = ({ open, onClose, onSubmit }) => {
  return (
    <>
      {open && (
        <div className="add-card-modal-wrapper">
          <div className="add-card-modal">
            <IconButton icon="remove" onClick={onClose} />
            <p className="text-heading3 text--lime text--center modal-title">Add a Credit Card</p>
            <Formik
              initialValues={{
                name: '',
                cardNumber: '',
                country: '',
                postalCode: '',
                expiry: '',
                cvv: ''
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <div className="form-control-group">
                      <FormControl className="d-form-control" isInvalid={Boolean(errors.name && touched.name)}>
                        <FormLabel className="d-form-label">Name (As it appears on your card)</FormLabel>
                        <Input
                          name="name"
                          className="d-form-outlined-input"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <FormHelperText className="d-form-helper-text">
                          {errors.name && touched.name && String(errors.name)}
                        </FormHelperText>
                      </FormControl>
                      <FormControl
                        className="d-form-control"
                        isInvalid={Boolean(errors.cardNumber && touched.cardNumber)}
                      >
                        <div className="card-input">
                          {values.cardNumber.length === 0 && (
                            <div className="card-input-placeholder">
                              <span className="text-body1 card-input-label">
                                <Icon name="payment" />
                                Card Number
                              </span>
                            </div>
                          )}
                          <Input
                            name="cardNumber"
                            className="d-form-outlined-input"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <FormHelperText className="d-form-helper-text">
                          {errors.cardNumber && touched.cardNumber && String(errors.cardNumber)}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div className="form-control-group">
                      <FormControl>
                        <FormLabel className="d-form-label">Expiry</FormLabel>
                        <Input
                          name="expiry"
                          className="d-form-outlined-input"
                          value={values.expiry}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <FormHelperText className="d-form-helper-text">
                          {errors.expiry && touched.expiry && String(errors.expiry)}
                        </FormHelperText>
                      </FormControl>
                      <FormControl
                        className="d-form-control"
                        isInvalid={Boolean(errors.postalCode && touched.postalCode)}
                      >
                        <FormLabel className="d-form-label">CVV</FormLabel>
                        <Input
                          name="cvv"
                          className="d-form-outlined-input"
                          value={values.cvv}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <FormHelperText className="d-form-helper-text">
                          {errors.cvv && touched.cvv && String(errors.cvv)}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div className="form-control-group">
                      <FormControl>
                        <FormLabel className="d-form-label">Country</FormLabel>
                        <Select
                          options={COUNTRIES}
                          value={values.country}
                          isInvalid={Boolean(errors.country && touched.country)}
                          onChange={(value) => setFieldValue('country', value)}
                        />
                        <FormHelperText className="d-form-helper-text">
                          {errors.country && touched.country && String(errors.country)}
                        </FormHelperText>
                      </FormControl>
                      <FormControl
                        className="d-form-control"
                        isInvalid={Boolean(errors.postalCode && touched.postalCode)}
                      >
                        <FormLabel className="d-form-label">Postal Code</FormLabel>
                        <Input
                          name="postalCode"
                          className="d-form-outlined-input"
                          value={values.postalCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <FormHelperText className="d-form-helper-text">
                          {errors.postalCode && touched.postalCode && String(errors.postalCode)}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div className="form-action">
                      <Button className="d-button" type="submit">
                        Add Card
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};
