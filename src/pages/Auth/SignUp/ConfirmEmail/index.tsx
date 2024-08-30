import { Button } from '@chakra-ui/core';
import React, { FC } from 'react';
import { useHistory } from 'react-router';

import { AnimationOnScroll } from '../../../../components';
import { ROUTES } from '../../../../constants';
import './styles.scss';

export const ConfirmEmailPage: FC = () => {
  const history = useHistory();

  const handleLogin = () => {
    history.push(ROUTES.AUTH.SIGN_IN);
  };

  return (
    <div className="confirm-email-page">
      <AnimationOnScroll animation="animate__bounce" delay={4}>
        <div className="page-title auth-page-title">
          <h2 className="text-heading2">Confirm Email.</h2>
        </div>
      </AnimationOnScroll>
      <div className="content">
        <h2>To activate your account, Please check your inbox and click on the confirmation link we just sent you.</h2>
        <div className="email-info">
          <AnimationOnScroll animation="animate__fadeIn" delay={2}>
            <span className="text-heading5 text-body3--lg">HAVEN'T RECIEVED OUR EMAIL?</span>
            <br />
            <span className="text-heading5 text-body3--lg">PLEASE CHECK YOUR SPAM FOLDER OR SELECT RESEND</span>
          </AnimationOnScroll>
        </div>
        <div className="action">
          <AnimationOnScroll animation="animate__fadeIn" delay={2}>
            <Button className="d-button d-button--full-width account-button" onClick={handleLogin}>
              Resend Confirmation Email
            </Button>
          </AnimationOnScroll>
        </div>
      </div>
    </div>
  );
};
