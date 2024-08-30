// Dependencies
import React, { FC } from 'react';
import classnames from 'classnames';

// Components
import { Icon, IIcon } from '../../../../../components';

// Styles
import './styles.scss';

// Interfaces
interface IPrepaidCryptoProps {
  icon: IIcon;
  coins: number;
  label: string;
  endIcon: IIcon;
  onClick?: () => void;
  selected?: boolean;
  toggleOption?: boolean;
  unit?: string;
}

// Export PrepaidCrypto
export const PrepaidCrypto: FC<IPrepaidCryptoProps> = ({
  icon,
  coins,
  label,
  selected,
  toggleOption,
  endIcon,
  onClick,
  unit
}) => {
  return (
    <div
      className={classnames('prepaid-crypto', { disabled: !(coins || toggleOption || selected) })}
      onClick={coins || toggleOption || selected ? onClick : undefined}
    >
      <div className="icon-wrapper">
        <Icon name={icon} />
      </div>
      <span className="text-body2 crypto-label">
        {unit == 'ETH' ? coins : coins.toFixed(2)} - {selected ? `Test ${label}` : toggleOption ? label : `Add ${label} to prepaid balance`}
      </span>
      <Icon name={endIcon} className="end-icon" />
    </div>
  );
};
