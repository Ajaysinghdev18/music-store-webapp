import { Button, FormControl, FormHelperText, Input, useToast } from '@chakra-ui/core';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import { AuthApi } from '../../../apis';
import { Alert, AnimationOnScroll, Icon } from '../../../components';
import { ROUTES } from '../../../constants';
import './styles.scss';

interface ISignUpValues {
  name: string;
  email: string;
  username: string;
  password: string;
}

export const SignUpPage: FC = () => {
  const { t } = useTranslation();

  const history = useHistory();

  const toast = useToast();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('Validation.Name is required!') as string),
    username: Yup.string().required(t('Validation.Username is required!') as string),
    email: Yup.string()
      .email(t('Validation.Email is not valid!') as string)
      .required(t('Validation.Email is required!') as string),
    password: Yup.string()
      .required(t('Validation.Password is required!') as string)
      .matches(/[a-zA-Z]/, t('Validation.Password should contain at least one alphabet!') as string)
      .matches(/\d/, t('Validation.Password should contain at least one number!') as string)
      .min(8, t('Validation.Password should contain at least 8 characters!') as string)
  });

  const handleSubmit = (values: ISignUpValues, { setSubmitting }: FormikHelpers<ISignUpValues>) => {
    AuthApi.register(values)
      .then(() => {
        setSubmitting(false);
        console.log('🚀 ~ file: index.tsx:56 ~ .then ~ ROUTES.AUTH.CONFIRM_EMAIL:', ROUTES.AUTH.CONFIRM_EMAIL);
        history.push(ROUTES.AUTH.CONFIRM_EMAIL);
      })
      .catch((err) => {
        const message = err.msg || 'Something went wrong';
        setSubmitting(false);
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={message} color="red" onClose={onClose} />
        });
      });
  };

  const handleLogin = () => {
    history.push(ROUTES.AUTH.SIGN_IN);
  };

  const getTFuncValue = (value: string): string => {
    return t(`Auth.${value}`)
  };

  return (
    <div className="sign-up-page">
      <AnimationOnScroll animation="animate__bounce" delay={4}>
        <div className="page-title auth-page-title">
          <h2 className="text-heading2">{t('Auth.Create account')}.</h2>
        </div>
      </AnimationOnScroll>
      <div className="content">
        <Formik
          initialValues={{ name: '', email: '', username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <AnimationOnScroll animation="animate__backInUp" delay={1}>
              <Form className="form" onSubmit={handleSubmit}>
                <FormControl className="d-form-control" isInvalid={Boolean(errors.name && touched.name)}>
                  <Input
                    className="d-form-input"
                    placeholder={getTFuncValue('Enter your full name')}
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormHelperText className="d-form-helper-text">
                    {errors.name && touched.name && String(errors.name)}
                  </FormHelperText>
                </FormControl>
                <FormControl className="d-form-control" isInvalid={Boolean(errors.email && touched.email)}>
                  <Input
                    className="d-form-input"
                    placeholder={getTFuncValue('Enter your email')}
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
                <FormControl className="d-form-control" isInvalid={Boolean(errors.username && touched.username)}>
                  <Input
                    className="d-form-input"
                    placeholder={getTFuncValue('Enter your username')}
                    name="username"
                    type="text"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormHelperText className="d-form-helper-text">
                    {errors.username && touched.username && String(errors.username)}
                  </FormHelperText>
                </FormControl>
                <FormControl className="d-form-control" isInvalid={Boolean(errors.password && touched.password)}>
                  <Input
                    className="d-form-input"
                    placeholder={getTFuncValue('Choose a Password')}
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormHelperText className="d-form-helper-text">
                    {errors.password && touched.password && String(errors.password)}
                  </FormHelperText>
                </FormControl>
                <Button
                  className="d-button d-button--full-width account-button"
                  type="submit"
                  leftIcon={() => <Icon name="create-account" />}
                  isLoading={isSubmitting}
                >
                  {t('Auth.Create account')}
                </Button>
                <p className="text-body3 text-body3--lg agree-text">
                  {t('Auth.By clicking the form, you agree to our')} <Link to={ROUTES.TERMS_CONDITIONS}>{t('Auth.Terms and Conditions')}</Link>{' '}
                  {t('Auth.and')} <Link to={ROUTES.PRIVACY_STATEMENT}>{t('Auth.Privacy and Privacy and Cookies')}.</Link>
                </p>
              </Form>
            </AnimationOnScroll>
          )}
        </Formik>
        <div className="dividerContainer">
          <div className="divider" />
          <div className="orContainer">
            <span className="text-body2 text--black text-bold text-body3--lg ">{t('Auth.Or')}</span>
          </div>
          <div className="divider" />
        </div>
        <div className="action">
          <AnimationOnScroll animation="animate__fadeIn" delay={2}>
            <span className="text-heading5 text-body3--lg">{t('Auth.Already have an account')}?</span>
          </AnimationOnScroll>
          <AnimationOnScroll animation="animate__fadeIn" delay={2}>
            <Button className="d-button d-button--full-width account-button" onClick={handleLogin}>
              {t('Auth.Login')}
            </Button>
          </AnimationOnScroll>
        </div>
      </div>
    </div>
  );
};
