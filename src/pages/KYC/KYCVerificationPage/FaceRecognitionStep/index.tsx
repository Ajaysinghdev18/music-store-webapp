import { Button, useToast } from '@chakra-ui/core';
import React, { FC, useRef, useState } from 'react';

import { KycApi } from '../../../../apis';
import { Account, AccountPerson } from '../../../../assets/icons';
import { Alert } from '../../../../components';
import './style.scss';

interface FaceRecognitionStepProps {
  handleSubmit: (values: any) => void;
  handleBack: () => void;
  formData: any;
}

const FaceRecognitionStep: FC<FaceRecognitionStepProps> = ({ handleSubmit, handleBack, formData }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState('');
  const toast = useToast();
  const [frontPreview, setFrontPreview] = useState('');

  const handleFileUpload = () => {
    ref.current?.click();
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setFile(file);
    setFrontPreview(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="recognition">
      <div className="recognition-title text-white text-body1 text-helvetica">
        Please upload photo of handholding ID Document and Statement:
      </div>
      <div className="recognition-content text-white text-gemunu">
        <ul>
          <li className="text-body1">Upload a photo of you handholding the front of ID Document and Statement.</li>
          <li className="text-body1">
            Please write down the date of submission and the word "Music" on the Statement.
          </li>
          <li className="text-body1">
            Please ensure that the ID Certificate and Statement are clearly visible, and the texts on which are
            completely and fully exposed.
          </li>
        </ul>
      </div>
      <div className="upload-container text-helvetica">
        <div className="upload-box">
          <p className="text-body1">Click to upload:</p>
          <button className="upload-btn upload-card text-body1" onClick={handleFileUpload}>
            Choose file
          </button>
          <input
            className="absolute hide"
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            ref={ref}
            onChange={handleFileChange}
          />
        </div>
        <div className="upload-box">
          <p className="text-body1">Correct example:</p>
          <div className="example-card upload-card d-flex justify-center">
            {frontPreview ? (
              <img width={'100%'} src={frontPreview} />
            ) : (
              <>
                <AccountPerson className="account-person" />
                <Account className="account" />
                <div className="file-name">
                  <div>
                    <p className="text-body1">Music</p>
                    <span className="text-body1">17.02.2023</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="stage-actions">
        <button className="btn outlined text-gemunu" onClick={handleBack}>
          Back
        </button>
        <Button
          className="btn contained text-gemunu"
          isDisabled={file ? false : true}
          onClick={() => {
            const newKyc = new FormData();
            Object.keys(formData).forEach((key) => {
              if (formData[key] instanceof File) {
                newKyc.append(key, formData[key]);
              } else {
                newKyc.append(key, formData[key]);
              }
            });
            newKyc.append('faceId', file);
            KycApi.createKyc(newKyc)
              .then((res) => {
                toast({
                  position: 'top-right',
                  render: ({ onClose }) => <Alert message={res.msg} color="lime" onClose={onClose} />
                });
                handleSubmit({ faceId: file });
              })
              .catch((err) => {
                console.log('🚀 ~ file: AuditingIDInfoStep.tsx:22 ~ useEffect ~ err:', err);
              });
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default FaceRecognitionStep;
