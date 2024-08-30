// Dependencies
import { Button } from '@chakra-ui/core';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';

// Components
import { Footer as MainFooter } from '../../../components';
// Global constants
import { ROUTES } from '../../../constants';
// Styles
import './styles.scss';
import { useSelector } from 'react-redux';
import { getUser } from '../../../store/selectors';

// Create footer component
const Footer: FC = () => {
  // Get history from hook
  const history = useHistory();
  const { t } = useTranslation();
  const user = useSelector(getUser);

  const isTicketForm = useRouteMatch(ROUTES.HELP_CENTER.TICKETS.FORM);

  // Submit handler
  const handleSubmit = () => {
    history.push(ROUTES.HELP_CENTER.TICKETS.FORM);
  };

  // Return footer component
  return (
    <div className="help-center-footer">
      {!isTicketForm && (
        <div className="sub-footer">
          <span className="text-heading2 title">{t('Layout.Still can’t find an answer?')}</span>
          <span className="text-body1 description">{user ? t('Layout.Send us a ticket and we will get back to you.') : t('Layout.To sumbit the ticket please Login.')}</span>
          <Button className="d-button d-button--cyan" onClick={handleSubmit}>
            {user ? t('Layout.Submit a ticket') : t('Auth.Login')}
          </Button>
        </div>
      )}
      {/* <MainFooter /> */}
    </div>
  );
};

// Export footer component
export default Footer;
