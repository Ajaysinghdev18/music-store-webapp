import React, { useEffect, useState } from 'react';
import './style.scss';
import { Cancel, GreenEmail } from '../../../assets/icons';
import { Step, Stepper } from '../../../components';
import { useHistory } from 'react-router';
import { ROUTES } from '../../../constants';
import EmailTFA from './EmailTFA';
import EmailNew from './EmailNew';
import EmailVerification from './EmailVerification';
import EmailDone from './EmailDone';
import CalendarPage from '../../../components/Calendar';

export enum CHANGE_EMAIL_STEPS {
  TFA,
  ENTER_NEW_EMAIL,
  EMAIL_VERIFICATION,
  SKIP,
  DONE
};

const KYCEmailChangePage = () => {
  const [currentStep, setCurrentStep] = useState<CHANGE_EMAIL_STEPS>(CHANGE_EMAIL_STEPS.TFA);
  const history = useHistory();
  const handleNext = () => {
    if (currentStep === CHANGE_EMAIL_STEPS.DONE) {
      history.push(ROUTES.HOME);
    }
    else {
      if (currentStep === CHANGE_EMAIL_STEPS.EMAIL_VERIFICATION) setCurrentStep(currentStep + 2);
      else setCurrentStep(currentStep + 1);
    }
  }
  
  const handleBack = () => {
    if (currentStep === 0) history.go(-1);
    else {
      setCurrentStep(currentStep - 1);
    }
  }
  
  const handleClose = () => {
    history.go(-1);
  }
  
  return (
    <div className="email-change-container">
      <div className="email-change-dialog">
        <Cancel className="cancel-btn" onClick={handleClose}/>
        <div className="email-change-header">
          <GreenEmail />
          <div className="email-change-title">Change Email</div>
        </div>
        <div className="email-change-content">
          <Stepper activeStep={currentStep} onChange={setCurrentStep}>
            <Step stepNum={CHANGE_EMAIL_STEPS.TFA} format={true}>2FA</Step>
            <Step stepNum={CHANGE_EMAIL_STEPS.ENTER_NEW_EMAIL} format={true}>Enter New Email</Step>
            <Step stepNum={CHANGE_EMAIL_STEPS.EMAIL_VERIFICATION} format={true}>Email Verification</Step>
            <Step stepNum={CHANGE_EMAIL_STEPS.EMAIL_VERIFICATION} format={true} completed={true}>Done</Step>
          </Stepper>
          { currentStep === CHANGE_EMAIL_STEPS.TFA && <EmailTFA /> }
          { currentStep === CHANGE_EMAIL_STEPS.ENTER_NEW_EMAIL && <EmailNew /> }
          { currentStep === CHANGE_EMAIL_STEPS.EMAIL_VERIFICATION && <EmailVerification /> }
          { currentStep === CHANGE_EMAIL_STEPS.DONE && <EmailDone /> }
          {
            currentStep < 3 ? <div className="email-change-actions">
                <button className="email-change-action-contained" onClick={handleNext}>Next</button>
                <button className="email-change-action-outlined" onClick={handleBack}>
                  { currentStep === 0 ? 'Discard' : 'Go Back' }
                </button>
              </div>
              : <button className="email-change-action-contained" onClick={handleNext}>Back to Home</button>
          }
        </div>
      </div>
    </div>
  );
}

export default KYCEmailChangePage;
