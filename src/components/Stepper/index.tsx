// Dependencies
import React, { FC, ReactNode, isValidElement, cloneElement } from 'react';

// Styles
import './styles.scss';
import classnames from 'classnames';

// Interface
interface IStepProps {
  activeStep: number;
  children: ReactNode | ReactNode[];
  onChange?: (step: number) => void;
}

// Export stepper component
export const Stepper: FC<IStepProps> = ({ activeStep, children, onChange }) => {
  // Create steps from children
  const steps = Array.isArray(children) ? children : [children];

  // Step click handler
  const handleStepClick = (step: number) => {
    if (onChange) onChange(step);
  };

  const completed = steps.length === activeStep;

  // Return stepper component
  return (
    <div className={classnames("d-stepper", { completed })}>
      {steps.map((child, index) => {
        if (isValidElement(child)) {
          const isActive = activeStep === index;
          const isCompleted = activeStep > index;

          const childProps = {
            key: index,
            active: isActive,
            completed: isCompleted,
            onClick: isCompleted ? (step: number) => handleStepClick(step) : null
          };

          return cloneElement(child, childProps);
        }
        return null;
      })}
    </div>
  );
};
