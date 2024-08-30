import { useToast } from '@chakra-ui/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import queryString from 'query-string';
import React, { useEffect } from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import { AuthApi } from '../../../apis';
import { Alert } from '../../../components';
import { ROUTES } from '../../../constants';

export const Verify: FC = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const token = queryParams.get('token');
  const history = useHistory();

  const toast = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    AuthApi.verify({ token: token })
      .then(() => {
        history.push(ROUTES.AUTH.SIGN_IN);
        toast({
          position: 'top-right',
          render: ({ onClose }) => (
            <Alert message={t('Message.Welcome. Your account is successfully verified.')} onClose={onClose} />
          )
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history, toast, token, t]);
  return <></>;
};
