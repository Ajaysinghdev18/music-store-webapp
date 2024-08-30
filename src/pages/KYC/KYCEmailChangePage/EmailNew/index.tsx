import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FormControl, FormHelperText, Input } from '@chakra-ui/core';
import './style.scss';
import TextField from '../../../../components/TextField';

const validationSchema = Yup.object().shape({
  newEmail: Yup.string().required('SUPPORTING TEXT!'),
});

const EmailNew = () => {
  
  const handleSubmit = () => {
    return;
  }
  
  return (
    <Formik
      enableReinitialize
      initialValues={{
        newEmail : '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <Form className="new-container">
          <FormControl>
            <TextField
              name={`newEmail`}
              type={'text'}
              label='New Email'
              value={values.newEmail}
              isInvalid={Boolean(errors['newEmail'] && touched['newEmail'])}
              helperText={errors['newEmail'] && touched['newEmail'] ? String(errors['newEmail']) : undefined}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FormControl>
        </Form>
      )}
    </Formik>
  );
};

export default EmailNew;
