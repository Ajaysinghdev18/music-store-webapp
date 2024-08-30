import React, { FC, useEffect } from 'react';
import { Auditing } from '../../../../assets/icons';
import './style.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants';
import { KycApi } from '../../../../apis';
interface AuditingIDInfoStepProps {
    formData?: any;
}


export const AuditingIDInfoStep: FC<AuditingIDInfoStepProps> = () => {
    return (
        <div className="items-center d-flex flex-column ">
            <Auditing />
            <div className="auditing-title text-center text-heading3">
                Auditing ID info
            </div>
            <div className="auditing-content text-center text-helvetica text-body1">
                The result will be sent to your Email in 1-3 working days.
            </div>
            <div className="auditing-content text-center text-helvetica text-body1">
                Please check your mailbox.
            </div>
            <Link className="back-button text-gemunu text-body1"  to={ROUTES.HOME}>
                Back to Home
            </Link>
        </div>
    );
}
