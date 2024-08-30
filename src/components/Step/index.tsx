// Dependencies
import React, { FC, ReactNode } from 'react';
import { Icon } from '@chakra-ui/core';
import classnames from 'classnames';

// Styles
import './styles.scss';

// Interfaces
interface IStepProps {
  active?: boolean;
  completed?: boolean;
  stepNum: number;
  children: string | ReactNode;
  onClick?: (stepNum: number) => void;
  format?: boolean;
}

// Export step component
export const Step: FC<IStepProps> = ({ stepNum, active = false, completed = false, children, onClick , format= false}) => {
  // Step click handler
  const handleClick = () => {
    if (onClick) onClick(stepNum);
  };

  const start = stepNum === 0;
  // Return step component
  return (
    <div className={classnames('d-step', { active, completed, format, start })}>
      <div className="d-step-content">
        {typeof children === 'string' ? <h4 className="text-heading4 d-step-label">{children}</h4> : { children }}
        <div className="d-step-icon" onClick={handleClick}>
          {completed ? <Icon name="check" /> : <span className="text-body2">{stepNum + 1}</span>}
        </div>
      </div>
      <div className="d-step-connector" />
    </div>
  );
};
