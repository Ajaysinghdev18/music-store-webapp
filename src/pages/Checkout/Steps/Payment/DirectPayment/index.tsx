import React, { FC, useState } from 'react';
import { Icon, Select, Selectable } from '../../../../../components';
import { Button } from '@chakra-ui/core';
import QRCode from 'react-qr-code';
import { PaymentApi } from '../../../../../apis';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../../store/selectors';
import { copyTextToClipboard } from '../../../../../utils';

import './styles.scss';

interface IDirectPaymentProps {
  onClose: () => void;
}

const options = [
  {
    label: 'ETHEREUM (ETH)',
    value: 'ETH'
  },
  {
    label: 'CASPER (CSPR)',
    value: 'CSPR'
  },
];

export const DirectPayment: FC<IDirectPaymentProps> = ({ onClose }) => {
  const [coin, setCoin] = useState<string>('ETH');
  const [isGeneratingAddress, setIsGeneratingAddress] = useState<boolean>(false);
  const [generatedAddress, setGeneratedAddress] = useState<string>('');
  const [isAddressCopied, setIsAddressCopied] = useState<boolean>(false);

  // Get user from store
  const user = useSelector(getUser);

  // Coin change handler
  const handleCoinChange = (value: string) => {
    setCoin(value);
  };

  // Copy Address to Clipboard
  const copyAddress = () => {
    setIsAddressCopied(true);
    copyTextToClipboard(generatedAddress);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 1500);
  };

  // Generate address handler
  const handleGenerate = async () => {
    if (coin) {
      setIsGeneratingAddress(true);
      const { address } = await PaymentApi.getDepositAddress({
        options: {
          id: user?.id,
          currency: coin
        }
      });
      setGeneratedAddress(address);
      setIsGeneratingAddress(false);
    }
  };

  return (
    <div className="direct-payment">
      <div className="direct-payment-content">
        <div className="deposit-items">
          <div className="deposit-item">
            <div className="deposit-step">
              <span className="text-body2">1</span>
              <div className="step-divider" />
              <span className="text-body2">2</span>
            </div>
            <div className="wrapper">
              <p className="text-heading4 label">Select Coin</p>
              <Select options={options} value={coin} onChange={handleCoinChange} />
              <p className="text-heading4 label">Select public chain</p>
              <div className="public-cards">
                <Selectable name="TRC20" value="TRON" fees={0.79} />
                <Selectable name="ERC20" value="Ethereum / ERC-20" fees={4.2} />
              </div>
              <Button
                className="d-button d-button--full-width"
                leftIcon={() => <Icon name="settings" />}
                onClick={handleGenerate}
              >
                Generate {generatedAddress ? 'New' : ''} Address
              </Button>
              <p className="text-body2 text--lime description">Deposit restrictions and limits</p>
            </div>
          </div>
          {generatedAddress && !isGeneratingAddress && (
            <div className="deposit-item">
              <div className="wrapper">
                <p className="text-heading4 label">Deposit To:</p>
                <span className="deposit-address" onClick={copyAddress}>
                  <span className="text-heading4 text--lime">{generatedAddress}</span>
                  {isAddressCopied ? <span className="text--lime copy">COPIED</span> : <Icon name="copy" />}
                </span>
                <p className="text-heading4 label">Or scan the QR code:</p>
                <QRCode value={generatedAddress} bgColor="#000" fgColor="#fff" size={108} />
              </div>
            </div>
          )}
        </div>
        <p className="text-body2 text--cyan text--center">
          You can exit this page after successfully paid the amount using this address;
          <br />
          Your order will be in your email inbox, after payment verification.
        </p>
        <div className="actions">
          <Button className="d-button" onClick={onClose}>
            BACK
          </Button>
        </div>
      </div>
    </div>
  );
};
