import React from 'react';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../store/selectors';
import './style.scss';

const EmailDone = () => {
  const user = useSelector(getUser);
  return (
    <div className="email-done-box">
      <div className="logo">
        Your Email address successfully changed to
      </div>
      <div className="email">
        { user?.email }
      </div>
    </div>
  );
};

export default EmailDone;
