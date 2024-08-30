// Dependencies
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Icon } from '../Icon';

// Styles
import './styles.scss';
import classnames from 'classnames';

// Interfaces
interface IOption {
  label: string;
  value: any;
}

interface ISelectProps {
  options: IOption[];
  value: any;
  placeholder?: string;
  onChange: (value: any) => void;
  isInvalid?: boolean;
  className?: string;
  isDisabled?: boolean;
  type?: string;
}

// Export select component
export const Select: FC<ISelectProps> = ({ options, isDisabled, value, className, placeholder, isInvalid, onChange, type }) => {
  // States
  const [visibleOptions, setVisibleOptions] = useState<boolean>(false);

  // Get selected option from value props
  const selectedOption = useMemo(
    () => options.find(({ value: v }) => value === v),
    // eslint-disable-next-line
    [value]
  );

  // Click handler
  const handleClick = () => {
    setVisibleOptions(!visibleOptions);
  };

  // Select handler
  const handleSelect = (v: any) => {
    onChange(v);
    setVisibleOptions(false);
  };

  // Prevent click handler
  const handlePreventClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // On mounted
  useEffect(() => {
    window.onclick = () => {
      setVisibleOptions(false);
    };

    return () => {
      window.onclick = null;
    };
  }, []);

  // Return select component
  return (
    !type ? <div
      className={classnames(`d-select ${className}`, {
        'd-select--opened': visibleOptions,
        'd-select--error': isInvalid
      })}
      onClick={handlePreventClick}
    >
      <div className="d-selected-option"  onClick={handleClick}>
        <span className="text-heading4 text-center">{selectedOption ? selectedOption.label : placeholder}</span>
        <Icon name="arrow-down" fill="lime" />
      </div>
      {visibleOptions && (
        <div className="d-options">
          {options.map(({ label, value: v }, index) => (
            <p key={index} className="d-option text-heading4" onClick={() => handleSelect(v)}>
              {label}
            </p>
          ))}
          <Icon name="arrow-up" />
        </div>
      )}
    </div> :
    <div
      className={classnames(`d-select ${className}`, {
        'd-select--opened': visibleOptions,
        'd-select--error': isInvalid
      })}
      onClick={handlePreventClick}
    >
      <div className="d-selected-option-2" onClick={handleClick}>
        <span className="text-heading4 text-center place-holder">{selectedOption ? selectedOption.label : placeholder}</span>
        <Icon name="arrow-down" fill="lime" />
      </div>
      {visibleOptions && (
        <div className="d-options">
          {options.map(({ label, value: v }, index) => (
            <p key={index} className="d-option-2 text-heading4" onClick={() => handleSelect(v)}>
              {label}
            </p>
          ))}
          <Icon name="arrow-up" />
        </div>
      )}
    </div>
  );
};
