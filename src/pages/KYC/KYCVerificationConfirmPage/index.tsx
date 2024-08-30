import React, { useEffect } from 'react';
import { Auditing } from '../../../assets/icons';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getKYCDetails, getUser } from '../../../store/selectors';
import { useHistory } from 'react-router';
import { UserApi } from '../../../apis';
import { setKYCDetails } from '../../../store/actions';
import { STATUS } from '../../Profile/Tabs';

const KYCVerificationConfirmPage = () => {
  const user = useSelector(getUser);
  const kycDetail = useSelector(getKYCDetails);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user?.id) {
      UserApi.getKYCStatus({
        query: {
          userId: user?.id,
          status: { $in: [STATUS.VERIFIED] },
        },
      }).then(res => {
        dispatch(setKYCDetails(res.kycs[0]))
      })
    }
  }, [user])
  const getType = (type: string) => {
    switch (type) {
      case 'id_cad': {
        return 'ID Card'
      }
      case 'passport': {
        return 'Passport'
      }
      case 'driver_licences': {
        return 'Driver Licences'
      }
    }
  }
  const history = useHistory();
  return (
    <div className="items-center d-flex flex-column verification-confirm-page-container">
      <Auditing />
      <div className="verification-logo text-center">
        Your ID Verification is Passed
      </div>
      <div className="verification-confirm-body">
        <div className="row verification-confirm-content justify-between">
          <div className="text-gray">Nationality</div>
          <div className="text-white">{kycDetail?.nationality}</div>
        </div>

        <div className="row verification-confirm-content justify-between">
          <div className="text-gray">Name</div>
          <div className="text-white">{kycDetail?.firstName}</div>
        </div>

        <div className="row verification-confirm-content justify-between">
          <div className="text-gray text-heading3">ID Type</div>
          <div className="text-white text-body1">{getType(kycDetail?.type)}</div>
        </div>

        <div className="row verification-confirm-content justify-between">
          <div className="text-gray">ID Number</div>
          <div className="text-white">{kycDetail?.idNumber}</div>
        </div>
      </div>
      <div className="back-button" onClick={() => history.go(-1)}>Back</div>
    </div>
  );
}

export default KYCVerificationConfirmPage;
