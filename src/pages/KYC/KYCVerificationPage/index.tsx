import React, { useEffect, useState } from 'react';
import { Stepper } from '../../../components';
import { Step } from '../../../components';
import './style.scss';
import BasicInfoStep from './BasicInfoStep';
import UploadCardStep from './UploadCardStep';
import FaceRecognitionStep from './FaceRecognitionStep';
import { AuditingIDInfoStep } from './AuditingIDInfo/AuditingIDInfoStep';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { getUser } from '../../../store/selectors';
import { STATUS } from '../../Profile/Tabs';
import { ROUTES } from '../../../constants';

export enum VerifyStep {
  BASIC_INFO,
  UPLOAD_CARD,
  FACE_RECOGNITION,
  AUDITING
}

const KYCVerificationPage = () => {
  const [currentStep, setCurrentStep] = useState(VerifyStep.BASIC_INFO);
  const [formData, setFormData] = useState<any>({});
  const history = useHistory();
  // Get user from store
  const user = useSelector(getUser);
  console.log('formData', formData)
  useEffect(() => {
    if (user) {
      if (user.KYCStatus === STATUS.UNDER_VERIFICATION || user.KYCStatus === STATUS.VERIFIED) {
        history.push(ROUTES.PROFILE.SETTINGS);
      }
    }
  }, [user])

  const handleChangeStep = (step: VerifyStep) => {
    if (currentStep === 3) {
      return
    }
    setCurrentStep(step);
  }
  const handleSubmit = (values: any) => {
    setFormData({ ...formData, ...values });
    setCurrentStep(currentStep + 1)
  };

  const handleBack = () => {
    if (currentStep === 3) {
      return
    }
    if (currentStep === 0) history.go(-1);
    setCurrentStep(currentStep - 1);
  }


  return (
    <div className="kyc-container-fluid">
      <div className="kyc-container col">
        <div className="text-title text-white text-gemunu text-heading1">ID Verification</div>
        <div className="stepper">
          <Stepper activeStep={currentStep} onChange={handleChangeStep}>
            <Step stepNum={VerifyStep.BASIC_INFO} format={true}>Basic Info</Step>
            <Step stepNum={VerifyStep.UPLOAD_CARD} format={true}>Upload ID Card</Step>
            <Step stepNum={VerifyStep.FACE_RECOGNITION} format={true}>Face Recognition</Step>
          </Stepper>
        </div>
        {currentStep === VerifyStep.BASIC_INFO && <BasicInfoStep handleSubmit={handleSubmit} handleBack={handleBack} formData={formData} />}
        {currentStep === VerifyStep.UPLOAD_CARD && <UploadCardStep handleSubmit={handleSubmit} handleBack={handleBack} formData={formData} />}
        {currentStep === VerifyStep.FACE_RECOGNITION && <FaceRecognitionStep formData={formData} handleSubmit={handleSubmit} handleBack={handleBack} />}
        {currentStep === VerifyStep.AUDITING && <AuditingIDInfoStep formData={formData} />}
      </div>
    </div>
  );
};

export default KYCVerificationPage;
