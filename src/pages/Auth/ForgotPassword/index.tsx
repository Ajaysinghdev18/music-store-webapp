import { Button, FormControl, FormHelperText, Input, useToast } from '@chakra-ui/core';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { AuthApi } from '../../../apis';
import { Alert, AnimationOnScroll } from '../../../components';
import './styles.scss';

interface ISignInValues {
  email: string;
  submit?: string;
}

export const ForgotPassword: FC = () => {
  const toast = useToast();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('Auth.Email is not valid!') as string)
      .required(t('Auth.Email is required!') as string)
  });

  const handleSubmit = (values: ISignInValues, { setSubmitting }: FormikHelpers<ISignInValues>) => {
    const { email } = values;
    setSubmitting(true);
    if (email) {
      AuthApi.forgotPassword(email)
        .then((res) => {
          setSubmitting(false);
          toast({
            position: 'top-right',
            render: ({ onClose }) => <Alert message={res.msg} color={res.success ? 'lime' : 'red'} onClose={onClose} />
          });
        })
        .catch((err) => {
          setSubmitting(false);
          toast({
            position: 'top-right',
            render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
          });
        });
    }
  };

  return (
    <div className="forgot-password-page">
      <AnimationOnScroll animation="animate__bounce" delay={2}>
        <div className="page-title auth-page-title">
          <h2 className="text-heading2">{t('Auth.Forgot your password?')}</h2>
        </div>
      </AnimationOnScroll>
      <AnimationOnScroll animation="animate__fadeIn" delay={1} className="content">
        {' '}
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form className="form" onSubmit={handleSubmit}>
              <div className="form-content">
                <FormControl className="d-form-control" isInvalid={Boolean(errors.email && touched.email)}>
                  <Input
                    className="d-form-input"
                    placeholder={t('Auth.Email') as string}
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormHelperText className="d-form-helper-text">
                    {errors.email && touched.email && String(errors.email)}
                  </FormHelperText>
                </FormControl>
                <Button type="submit" className="d-button d-button--full-width" isLoading={isSubmitting}>
                  {t('Auth.Send Email')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </AnimationOnScroll>
      <div className="hand-img" />
    </div>
  );
};
