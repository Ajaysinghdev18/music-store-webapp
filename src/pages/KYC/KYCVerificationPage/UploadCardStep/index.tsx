import { Button, Flex } from '@chakra-ui/core';
import React, { FC, useRef, useState } from 'react';
import { Account } from '../../../../assets/icons';
import './style.scss';

interface UploadCardStepProps {
    handleSubmit: (values: any) => void;
    handleBack: () => void;
    formData: any
}

const UploadCardStep: FC<UploadCardStepProps> = ({ handleSubmit, handleBack, formData }) => {

    const [frontProfile, setFrontProfile] = useState(formData.idFront ? formData.idFront : [])
    const [frontProfileLoaded, setFrontProfileLoaded] = useState(formData.idFront ? true : false)
    const [backProfileLoaded, setBackProfileLoaded] = useState(formData.idBack ? true : false)
    const [backProfile, setBackProfile] = useState(formData.idBack ? formData.idBack : [])
    const [frontPreview, setFrontPreview] = useState(formData.idFront ? URL.createObjectURL(formData.idFront) : '')
    const [backPreview, setBackPreview] = useState(formData.idBack ? URL.createObjectURL(formData.idBack) : '')

    const frontRef = useRef<HTMLInputElement>(null);
    const backRef = useRef<HTMLInputElement>(null);
    return (
        <div className="upload-content">
            <div className="recognition-title text-body1 text-white text-helvetica">
                Please upload photo of Front and back of Identity Card:
            </div>
            <div className="recognition-content text-white text-gemunu">
                <ul>
                    <li className='text-body1'>
                        Upload a color image of entire document.
                    </li>
                    <li className='text-body1'>
                        Screenshot are not allowed.
                    </li>
                    <li className='text-body1'>
                        JPEG, JPG and PNG format only.
                    </li>
                </ul>
            </div>
            <div className='upload-container'>
                <div className="upload-container-content text-helvetica">
                    <div className="upload-box">
                        <p className='text-body1'>
                            Front of ID Card here:
                        </p>
                        <button className="upload-btn upload-card text-body1" onClick={() => frontRef.current?.click()}>Choose file</button>
                        <input className="absolute hide" type="file" id="avatar"
                            name="frontProfile"
                            ref={frontRef}
                            accept='image/*'
                            onChange={(e: any) => {
                                setFrontProfileLoaded(true)
                                setFrontProfile(e.target.files[0])
                                setFrontPreview(URL.createObjectURL(e.target.files[0]))
                            }}
                        />
                    </div>
                    <div className="upload-box">
                        <p className='text-body1'>
                            Correct example:
                        </p>
                        <div className="example-card upload-card d-flex justify-center">
                            {frontPreview ? <img  width={'100%'} src={frontPreview} /> : <Account className="margin-auto center" />}
                        </div>
                    </div>
                </div>
                <div className="upload-container-content text-helvetica">
                    <div className="upload-box">
                        <p className='text-body1'>
                            Back of ID Card here:
                        </p>
                        <button className="upload-btn upload-card text-body1" onClick={() => backRef.current?.click()}>Choose file</button>
                        <input className="absolute hide"
                         type="file" id="avatar"
                            name="backProfile"
                            ref={backRef}
                            accept='image/*'
                            onChange={(e: any) => {
                                setBackProfileLoaded(true)
                                setBackProfile(e.target.files[0])
                                setBackPreview(URL.createObjectURL(e.target.files[0]))
                            }}
                        />
                    </div>
                    <div className="upload-box">
                        <p className='text-body1'>
                            Correct example:
                        </p>
                        <div className="example-card upload-card d-flex justify-center">
                            {backPreview ? <img width={'100%'} src={backPreview} /> : <Account className="margin-auto center" />}
                        </div>
                    </div>
                </div>
            </div>
            <div className='stage-actions'>
                <button className="btn outlined text-gemunu text-body1" onClick={handleBack}>Back</button>
                <Button className="btn contained text-gemunu text-body1" isDisabled={!frontProfileLoaded || !backProfileLoaded} onClick={() => handleSubmit({ idFront: frontProfile, idBack: backProfile })}>Next</Button>
            </div>

        </div>
    );
};

export default UploadCardStep;
