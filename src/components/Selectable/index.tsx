// Dependencies
import React, { FC, useState } from 'react';
import classnames from 'classnames';

// Styles
import './styles.scss';

// Interfaces
interface ISelectableProps {
  name: string;
  value: string;
  fees: number;
}

// Export selectable component
export const Selectable: FC<ISelectableProps> = ({ name, value, fees }) => {
  // State
  const [selected, setSelected] = useState<boolean>(false);

  // Click handler
  const handleClick = () => {
    setSelected(!selected);
  };

  // Return selectable component
  return (
    <div className="d-selectable-wrapper">
      <div
        className={classnames('d-selectable', {
          'd-selectable--selected': selected
        })}
        onClick={handleClick}
      >
        <p className="text-heading4 selectable-name">{name}</p>
        <p className="text-body2 selectable-value">{value}</p>
      </div>
      <p className="text-body2">Fees: {fees}</p>
    </div>
  );
};
