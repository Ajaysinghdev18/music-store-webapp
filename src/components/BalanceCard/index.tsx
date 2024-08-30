// Dependencies
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Icon, IIcon } from '../Icon';

// Styles
import './styles.scss';

// Global Constants
import { ROUTES } from '../../constants';
import { Button } from '@chakra-ui/core';
import { useSelector } from 'react-redux';
import { getUser } from '../../store/selectors';

export interface IBalanceType {
  id: string;
  icon: IIcon;
  name: string;
  amount: number;
  unit: string;
  type: string;
  price: string;
  coins: string;
}

interface IBalanceCardProps {
  balance: IBalanceType;
  isTest?: boolean;
  hasSetup?: boolean;
  handleSubSum?: (bal: IBalanceType) => void;
}

// Export balance-card component
export const BalanceCard: FC<IBalanceCardProps> = ({
  isTest, balance, hasSetup = false, handleSubSum
}) => {

  // Get user from store
  const user = useSelector(getUser);
  // Get history from hook
  const history = useHistory();

  // Go to deposit handler
  const handleGoToDeposit = () => {
    history.push(`${ROUTES.CRYPTO.DEPOSIT}?coin=${balance?.unit}`);
  };

  // Go to withdraw handler
  const handleGoToWithdraw = () => {
    history.push(`${ROUTES.CRYPTO.WITHDRAW}?coin=${balance?.unit}`);
  };
  // Return balance-card component
  return (
    <div className="balance-card">
      <div>
        {isTest && (
          <div className="ribbon-container">
            <img src="/images/ribbon.png" alt="ribbon" />
            <span>Test</span>
          </div>
        )}
        <div className="balance-card-header">
          <Icon
            name={balance.icon}
            className="balance-icon"
            width={32}
            height={32}
          />
          <div className="balance-name">
            {`${balance.name} (${balance.unit})`}
          </div>
        </div>
        <div className="balance-content">
          {user?.isKYCVerified && <div className="balance-account">
            <Icon
              name={balance.icon}
              className="balance-account-icon"
              width={12}
              height={12}
            />
            <div>{`${balance?.coins || 0}`}</div>
          </div>}
          <div className="button-container">
            {user?.isKYCVerified ? (
              <div className='button-wrapper'>
                <Button className="d-outlined-button action-button" onClick={handleGoToDeposit} >
                  Add Balance
                </Button>
                <Button className="d-outlined-button action-button" onClick={handleGoToWithdraw} >
                  Withdraw
                </Button>
              </div>
            ) : (
              <div className='button-wrapper'>
                <Button className="d-outlined-button action-button" onClick={() => handleSubSum && handleSubSum(balance)}>
                  {'Setup'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
