// Dependencies
import React, { FC } from 'react';
import { IconButton } from '../IconButton';

// Styles
import './styles.scss';
import { ModalCloseButton } from '@chakra-ui/core';
import { AiOutlineCloseCircle } from 'react-icons/ai';

// Interfaces
interface IAlertProps {
  message: string;
  color?: 'yellow' | 'lime' | 'cyan' | 'red';
  onClose?: () => void;
}

// Export alert component
export const Alert: FC<IAlertProps> = ({ message, color = 'lime', onClose }) => {
  // Return alert component
  return (
    <div className={`d-alert ${color}`}>
      <span className="text-body1 d-alert-message">{message}</span>
      <IconButton icon="remove" onClick={onClose} />
    </div>
  );
};
