// Dependencies
import React, { FC } from 'react';

// Components
import { IconButton } from '../IconButton';

// Styles
import './styles.scss';

// Interfaces
interface IModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

// Export record modal
export const RecordModal: FC<IModalProps> = ({ open, title, onClose, children }) => {
  // Return record modal
  return (
    <>
      {open && (
        <div className="record-modal-wrapper">
          <div className="record-modal">
            <IconButton icon="remove" className="close-button" onClick={onClose} />
            <p className="text-heading3 text--lime text--center record-modal-title">{title}</p>
            <div className="record-modal-content">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
