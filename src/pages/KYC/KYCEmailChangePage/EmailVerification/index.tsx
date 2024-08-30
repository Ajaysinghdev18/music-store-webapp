import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FormControl, FormHelperText, Input } from '@chakra-ui/core';
import './style.scss';
import TextField from '../../../../components/TextField';

const validationSchema = Yup.object().shape({
  verificationCode: Yup.string().required('SUPPORTING TEXT!'),
});

const EmailVerification = () => {
  
  const handleSubmit = () => {
    return;
  }
  
  return (
    <Formik
      enableReinitialize
      initialValues={{
        verificationCode : '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <Form className="verification-container">
          <FormControl>
            <TextField
              name={`verificationCode`}
              type={'text'}
              label={`Email Verification Code`}
              value={values['verificationCode']}
              isInvalid={Boolean(errors['verificationCode'] && touched['verificationCode'])}
              helperText={errors['verificationCode'] && touched['verificationCode'] ? String(errors['verificationCode']) : undefined}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FormControl>
        </Form>
      )}
    </Formik>
  );
};

export default EmailVerification;
