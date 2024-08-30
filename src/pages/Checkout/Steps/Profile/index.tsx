// Dependencies
import React, { FC, MutableRefObject } from 'react';
import { Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import { FormControl, FormHelperText, Input } from '@chakra-ui/core';
import * as Yup from 'yup';

// Constants
import { PhoneRegExp } from '../../../../constants/constants';

// Interfaces
import { CheckoutStep } from '../../index';
import { getUser } from '../../../../store/selectors';

interface IProfileStepProps {
  formClass: (step: CheckoutStep) => string;
  submitRef: MutableRefObject<HTMLButtonElement | null>;
  handleSubmit: (values: any) => void;
}

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required!'),
  phoneNumber: Yup.string().matches(PhoneRegExp, 'Phone number is not valid!')
});

// Export Profile step
export const ProfileStep: FC<IProfileStepProps> = ({ submitRef, formClass, handleSubmit }) => {
  // Get user from store
  const user = useSelector(getUser);

  // Return Profile step
  return (
    <div className={formClass(CheckoutStep.Profile)}>
      <Formik
        enableReinitialize
        initialValues={{
          name: user?.name,
          phoneNumber: user?.phoneNumber
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.name && touched.name)}>
              <Input
                className="d-form-input"
                placeholder="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormHelperText className="d-form-helper-text">
                {Boolean(errors.name && touched.name) && String(errors.name)}
              </FormHelperText>
            </FormControl>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.phoneNumber && touched.phoneNumber)}>
              <Input
                className="d-form-input"
                placeholder="Phone Number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormHelperText className="d-form-helper-text">
                {Boolean(errors.phoneNumber && touched.phoneNumber) && String(errors.phoneNumber)}
              </FormHelperText>
            </FormControl>
            <button type="submit" ref={submitRef} />
          </Form>
        )}
      </Formik>
    </div>
  );
};
