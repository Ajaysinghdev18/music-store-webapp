// Dependencies
import React, { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/core';
import classnames from 'classnames';

// Icon
import { Icon, IIcon } from '../Icon';

// Styles
import './styles.scss';

// Interfaces
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon?: IIcon;
  color?: 'white' | 'magenta' | 'cyan' | 'lime';
  children?: ReactNode;
  text?: string;
  backgroundColor?: string;
  paddingX?: string;
  fullWidth?: boolean;
  fontWeight?: number;
}

// Export icon-button component
export const IconButton: FC<IconButtonProps> = ({
  fullWidth,
  backgroundColor,
  fontWeight,
  justifyContent,
  paddingX,
  text,
  icon,
  className,
  color = 'white',
  children,
  ...props
}) => (
  <>
    {text ? (
      <Button
        className='icon-button-text'
        cursor="pointer"
        isFullWidth={fullWidth}
        backgroundColor={backgroundColor}
        fontWeight={fontWeight}
        justifyContent={justifyContent}
        paddingX={paddingX}
        {...props}
      >
        {icon ? <Icon name={icon} /> : null}
        {text}
      </Button>
    ) : (
      <Button
        className={classnames(`d-icon-button d-icon-button--${color}`, {
          [className as string]: className
        })}
        {...props}
      >
        {icon ? <Icon name={icon} /> : children}
      </Button>
    )}
  </>
);
