import React, { FC } from 'react';
import { CheckOut } from '../../assets/icons';
import './style.scss';
import classnames from 'classnames';

export interface ICheckToggleButton {
    title?: string,
    id?: string 
    setFieldValue?: (value: string, value1: string) => void;
    selectedValue?: string;
    value?: string;
}

const CheckToggleButton: FC<ICheckToggleButton> = ({
    title,
    setFieldValue,
    selectedValue,
    value,
    id
}) => {
    return (
        <button
            id={id}
            className={classnames('custom-button', {
                'active-button': value == selectedValue
            })}
            onClick={(e) => {
                setFieldValue && setFieldValue('type', value!);
                e.preventDefault();
            }}
        >
            {value == selectedValue && <CheckOut />}
            <div className='text-body1'>{title}</div>
        </button>
    );
}

export default CheckToggleButton;
