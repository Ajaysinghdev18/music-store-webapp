import React, { FC } from 'react';
import './style.scss';
import { CheckOut } from '../../assets/icons';

interface ICustomCheckBox {
  isCheck: boolean;
  toggleCheck: () => void;
}

export const CustomCheckBox: FC<ICustomCheckBox> = ({
  isCheck,
  toggleCheck,
  }) => {
  return (
    <div className="check-box-outline" onClick={toggleCheck}>
      { isCheck && <div className="check-box-toggle"><CheckOut /></div>}
    </div>
  );
}
