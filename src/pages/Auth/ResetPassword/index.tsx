import { Button, FormControl, FormHelperText, Input } from '@chakra-ui/core';
import { Form, Formik, FormikHelpers } from 'formik';
// import queryString from 'query-string';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';

import { AuthApi } from '../../../apis';
import { AnimationOnScroll, IconButton } from '../../../components';
import { ROUTES } from '../../../constants';
import './styles.scss';

interface IResetPassword {
  password: string;
  confirmPassword: string;
}

export const ResetPassword: FC = () => {
  const [visiblePassword, setVisiblePassword] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({
    password: false,
    confirmPassword: false
  });

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const token = queryParams.get('token');
  const history = useHistory();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(/[a-zA-Z]/, t('Validation.Password should contain at least one alphabet!') as string)
      .matches(/\d/, t('Validation.Password should contain at least one number!') as string)
      .min(8, t('Validation.Password should contain at least 8 characters!') as string),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('Validation.Input a correct password!') as string)
      .required(t('Validation.Input a correct password!') as string)
      .matches(/[a-zA-Z]/, t('Validation.Password should contain at least one alphabet!') as string)
      .required(t('Validation.Password should contain at least one alphabet!') as string)
      .matches(/\d/, t('Validation.Password should contain at least one number!') as string)
      .required(t('Validation.Password should contain at least one number!') as string)
      .min(8, t('Validation.Password should contain at least 8 characters!') as string)
      .required(t('Validation.Password should contain at least 8 characters!') as string)
  });

  const toggleVisiblePassword = (field: 'password' | 'confirmPassword') => {
    setVisiblePassword({
      ...visiblePassword,
      [field]: !visiblePassword[field]
    });
  };

  const handleSubmit = (values: IResetPassword, { setSubmitting }: FormikHelpers<IResetPassword>) => {
    const { password } = values;
    AuthApi.resetPassword(password, token as string)
      .then(() => {
        history.push(ROUTES.AUTH.SIGN_IN);
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitting(true);
      });
  };

  return (
    <div className="reset-password-page">
      <AnimationOnScroll animation="animate__bounce" delay={2}>
        <div className="page-title auth-page-title">
          <h2 className="text-heading2">{t('Auth.Reset your password')}</h2>
        </div>
      </AnimationOnScroll>
      <AnimationOnScroll animation="animate__fadeIn" delay={1} className="content">
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form className="form" onSubmit={handleSubmit}>
              <div className="form-content">
                <FormControl className="d-form-control" isInvalid={Boolean(errors.password && touched.password)}>
                  <div className="confirm-password-wrapper">
                    <Input
                      className="d-form-input"
                      placeholder={t('Auth.New Password') as string}
                      name="password"
                      type={visiblePassword.password ? 'text' : 'password'}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <IconButton
                      className="toggle-visible-button"
                      icon="eye"
                      onClick={() => toggleVisiblePassword('password')}
                    />
                  </div>
                  <FormHelperText className="d-form-helper-text">
                    {errors.password && touched.password && String(errors.password)}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  className="d-form-control"
                  isInvalid={Boolean(errors.confirmPassword && touched.confirmPassword)}
                >
                  <div className="confirm-password-wrapper">
                    <Input
                      className="d-form-input"
                      placeholder={t('Auth.Confirm Password') as string}
                      name="confirmPassword"
                      type={visiblePassword.confirmPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <IconButton
                      className="toggle-visible-button"
                      icon="eye"
                      onClick={() => toggleVisiblePassword('confirmPassword')}
                    />
                  </div>
                  <FormHelperText className="d-form-helper-text">
                    {errors.confirmPassword && touched.confirmPassword && String(errors.confirmPassword)}
                  </FormHelperText>
                </FormControl>
                <Button type="submit" className="d-button d-button--full-width" isLoading={isSubmitting}>
                  {t('Auth.Reset Password')}
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
