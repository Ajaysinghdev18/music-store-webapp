// Dependencies
import { Button, ButtonProps, Stack } from '@chakra-ui/core';
import React, { FC } from 'react';
import './styles.scss'

interface IBaseButtonProps extends ButtonProps {
  onClick?: () => void;
  children: any;
  leftIcon?: any
  rightIcon?: any
  gradiant?:any;
  scheme: 'primary' | 'secondary' | 'basic'
}
const getBackgroundColor =( scheme: string )=>{
switch(scheme){
  case 'primary':
    return 'button-primary';
    case 'secondary': 
    return 'button-secondary';
    case 'basic':
      return 'button-basic'; 
}
}
// Create  button
export const PrimaryButton: FC<IBaseButtonProps> = ({ onClick, children, title, leftIcon, rightIcon, scheme, ...rest }) => {
const classes = `button ${getBackgroundColor(scheme)}`
  return (
    <Button className={classes} py={[1, 1, 2, 3]} fontSize={18} h={'fit-content'} onClick={onClick} w={'fit-content'} {...rest}>
      <Stack mr={2}>{leftIcon} </Stack>
      {children}
      <Stack ml={2}>{rightIcon}</Stack>
    </Button>
  );
};
