import React, { useEffect, useState } from 'react';
import './style.scss';
import { BasicInfo, FaceRecognition, Info, UploadCard } from '../../assets/icons';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { CustomCheckBox } from '../../components/CustomCheckBox';
import { Button } from '@chakra-ui/core';
import { useSelector } from 'react-redux';
import { getUser } from '../../store/selectors';
import { STATUS } from '../Profile/Tabs';

const KYCPage = () => {
  const [isCheckOn, setIsCheckOn] = useState<boolean>(false);
    // Get history from hook
    const history = useHistory();
    // Get user from store
    const user = useSelector(getUser);
  
    useEffect(() => {
      if (user) {
        if (user.KYCStatus === STATUS.UNDER_VERIFICATION || user.KYCStatus === STATUS.VERIFIED) {
          history.push(ROUTES.PROFILE.SETTINGS);
        }
      }
    }, [user])
  const idVerificationHandler = () => {
    history.push(ROUTES.KYC.VERIFY);
  }
  return (
    <div className="kyc-container-fluid">
      <div className="kyc-container">
        <div className="title text-gemunu text-heading1">ID Verification</div>
        <div className="process">
          <div className="subtitle text-heading2">How to Verify</div>
          <div className="d-flex stage-view full-width justify-between">
            <BasicInfo />
            <UploadCard />
            <FaceRecognition />
          </div>
        </div>

        <div className="d-flex flex-column">
          <div className="d-flex info">
            <p className="subtitle text-heading3">Attention</p>
          </div>
          <div className="d-flex info">
            <Info />
            <div className="desc text-body1">
              Please make sure that the info provided is identical to your ID info, and these information cannot be altered once the ID verification is passed.
            </div>
          </div>
          <div className="d-flex info">
            <Info />
            <div className="desc text-body1">
              If you didn't install camera on your computer, please scan the code when uploading the ID info and use your mobile phone for verification.
            </div>
          </div>
          <div className="d-flex info">
            <Info />
            <div className="desc text-body1">
              The audit results will be send to your Email in 1-3 working day, please check your mailbox.
            </div>
          </div>
        </div>
        <div className="actions-box">
          <div className="d-flex">
            <CustomCheckBox isCheck={isCheckOn} toggleCheck={() => setIsCheckOn(!isCheckOn)} />
            <div className="check-label text-body1">
              I promise that the information provided is my own, and there is no pirating of other people's information.
            </div>
          </div>
          <Button className="btn d-flex justify-center align-center" isDisabled={!isCheckOn} onClick={idVerificationHandler}>
            <p className='text-body1 text--black'>I'm all set for ID Verification</p>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default KYCPage;
