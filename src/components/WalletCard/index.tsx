// Dependencies
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';

// Components
import { Icon } from '../Icon';

// Styles
import './styles.scss';

// Interfaces


// Global Constants
import { ROUTES } from '../../constants';
import { IWallet } from '../../shared/interfaces';
import { useTranslation } from 'react-i18next';

interface IWalletCardProps {
  wallet?: IWallet;
  isDefault?: boolean;
  setCreateWalletModal?: (type: boolean) => void;
  visibleCreateWalletModal?: boolean;
}

// Export wallet-card component
export const WalletCard: FC<IWalletCardProps> = ({
  isDefault, wallet,
  setCreateWalletModal,
  visibleCreateWalletModal
}) => {
  // Get history from hook
  const history = useHistory();

  const { t } = useTranslation();

  // Go to detail page handler
  const handleGoToDetail = (id?: string) => () => {
    if (id) {
      history.push(ROUTES.PROFILE.WALLET.DETAIL.replace(':id', id));
    }
  };

  // Return wallet-card component
  return (
    <div className={classnames(
      'wallet-card',
      !wallet && 'add'
    )}>
      {wallet ? (
        <div onClick={handleGoToDetail(wallet?._id)}>
          {isDefault && (
            <div className="default-mark">Default</div>
          )}
          <div className="wallet-card-header">
            <Icon
              name={wallet?.icon || 'wallet'}
              className="wallet-icon"
            />
            <div className="wallet-name">
              {wallet.name}
            </div>
          </div>
          <div className="wallet-content">
            <div className="wallet-account">
              <Icon name={wallet.chain === 'CSPR' ? 'casper-coin' : 'ethereum'} className="wallet-account-icon" />
              <div>{`${wallet?.balance ? wallet.balance : 0} (${wallet.chain === 'CSPR' ? 'CSPR' : 'ETH'})`}</div>
            </div>

          </div>
        </div>
      ) : (
        <div className="add-content" onClick={() => setCreateWalletModal && setCreateWalletModal(!visibleCreateWalletModal)}>
          <Icon name="plus" className="plus-icon" />
          <div>{t('Wallet.ADD NEW WALLET')}</div>
        </div>
      )}
    </div>
  );
};
