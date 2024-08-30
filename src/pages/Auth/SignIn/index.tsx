import { Button, FormControl, FormHelperText, Input, useToast } from '@chakra-ui/core';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import { AuthApi } from '../../../apis';
import { Alert, AnimationOnScroll, Icon } from '../../../components';
import { ACCESS_TOKEN_KEY, ROUTES } from '../../../constants';
import { UserModel } from '../../../shared/models';
import { setUser } from '../../../store/actions';
import './styles.scss';

interface ISignInValues {
  email: string;
  password: string;
  submit?: string;
}

export const SignInPage: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const dispatch = useDispatch();

  const toast = useToast();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('Validation.Email is not valid!') as string)
      .required(t('Validation.Email is required!') as string),
    password: Yup.string()
      .required(t('Validation.Password is required!') as string)
      .min(8, t('Validation.Password must be at least 8 characters!') as string)
  });

  const handleCreateAccount = () => {
    history.push(ROUTES.AUTH.SIGN_UP);
  };

  const handleSubmit = (values: ISignInValues, { setSubmitting }: FormikHelpers<ISignInValues>) => {
    const { email, password } = values;

    AuthApi.login(email, password)
      .then((res) => {
        if (!res.user.verify) {
          setSubmitting(false);
          return toast({
            position: 'top-right',
            render: ({ onClose }) => (
              <Alert
                message={t('Auth.Account is not activated.') + ' ' + t('Auth.Checkout your inbox!')}
                onClose={onClose}
              />
            )
          });
        }
        const user = new UserModel(res.user);
        if (user) {
          dispatch(setUser(user));
        }

        if (res.token) {
          localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
        }
        history.push(ROUTES.HOME);

        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={t('Message.Successfully Sign in!')} onClose={onClose} />
        });
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

  return (
    <div className="sign-in-page">
      <AnimationOnScroll animation="animate__bounce" delay={2}>
        <div className="page-title auth-page-title">
          <h2 className="text-heading2">{t('Auth.Welcome.')}</h2>
        </div>
      </AnimationOnScroll>
      <AnimationOnScroll animation="animate__fadeIn" delay={1} className="content">
        <div className="actions">
          <div className="action-buttons">
            <Button
              className="d-button d-button--full-width"
              leftIcon={() => <Icon name="create-account" />}
              onClick={handleCreateAccount}
            >
              {t('Auth.Create account')}
            </Button>
            <Button className="d-button  d-button--full-width" leftIcon={() => <Icon name="apple" />}>
              {t('Auth.Login with Apple')}
            </Button>
            <Button className="d-button  d-button--full-width" leftIcon={() => <Icon name="google" />}>
              {t('Auth.Login with Google')}
            </Button>
          </div>
        </div>
        <div className="divider" />
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
                <FormControl className="d-form-control" isInvalid={Boolean(errors.password && touched.password)}>
                  <Input
                    className="d-form-input"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="on"
                  />
                  <FormHelperText className="d-form-helper-text">
                    {errors.password && touched.password && String(errors.password)}
                  </FormHelperText>
                </FormControl>
                <Button type="submit" className="d-button d-button--full-width" isLoading={isSubmitting}>
                  {t('Auth.Login')}
                </Button>
                <Link to="/forgot-password" className="text-body3 text-body3--lg">
                  {t('Forgot Password?')}
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </AnimationOnScroll>
      <div className="hand-img" />
    </div>
  );
};
