import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import './style.scss';
import TextField from '../../../../components/TextField';

const validationSchema = Yup.object().shape({
  verificationCode: Yup.string().required('SUPPORTING TEXT!'),
  smsCode: Yup.string().required('SUPPORTING TEXT'),
});

const EmailTFA = () => {
  
  const handleSubmit = () => {
    return;
  }
  
  return (
    <Formik
      enableReinitialize
      initialValues={{
        verificationCode : '',
        smsCode: ''
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
      <Form className="tfa-container">
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
  
        <TextField
          name='smsCode'
          type={'text'}
          label='SMS Code'
          value={values['smsCode']}
          isInvalid={Boolean(errors['smsCode'] && touched['smsCode'])}
          helperText={errors['smsCode'] && touched['smsCode'] ? String(errors['smsCode']) : undefined}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Form>
      )}
    </Formik>
  );
};

export default EmailTFA;
