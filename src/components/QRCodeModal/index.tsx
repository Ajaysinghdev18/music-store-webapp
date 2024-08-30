// Dependencies
import React, { FC } from 'react';

// Components
import { IconButton } from '../IconButton';

// Styles
import './styles.scss';

// Interfaces
interface IQrCodeModalProps {
  open: boolean;
  onClose: () => void;
}

// Export Qr Code modal
export const QrCodeModal: FC<IQrCodeModalProps> = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div className="qr-modal-wrapper">
          <div className="qr-modal">
            <IconButton icon="remove" onClick={onClose} />
            <p className="text-heading3 text--lime text--center modal-title">Add a Credit Card</p>
            <div className="qr-modal-content">
              <img src="/images/qr-code.png" alt="qr-code" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
