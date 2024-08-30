import React, { FC } from 'react';
import CheckToggleButton from '../../../../components/CheckToggleButton';
import './style.scss';
import { Button, FormControl } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { COUNTRIES, GENDER } from '../../../../constants';
import TextField from '../../../../components/TextField';

interface BasicInfoStepProps {
  handleSubmit: (values: any) => void;
  handleBack: () => void;
  formData: any;
}
const BasicInfoStep: FC<BasicInfoStepProps> = ({ handleSubmit, handleBack, formData }) => {
  const profile = {
    nationality: formData.nationality ? formData.nationality : '',
    firstName: formData.firstName ? formData.firstName : '',
    lastName: formData.lastName ? formData.lastName : '',
    gender: formData.gender ? formData.gender : '',
    birthday: formData.birthday ? formData.birthday : '',
    idNumber: formData.idNumber ? formData.idNumber : '',
    expiration: formData.expiration ? formData.expiration : '',
    type: formData.type ? formData.type : ''
  };

  const validationSchema = Yup.object().shape({
    nationality: Yup.string().required('Nationality is required!'),
    firstName: Yup.string().required('FirstName is required'),
    lastName: Yup.string().required('LastName is required'),
    gender: Yup.string().required('Gender is required'),
    birthday: Yup.date().required('Date is required'),
    idNumber: Yup.string().required('Phone number is not valid!'),
    expiration: Yup.date().required('Date of Expiration is required'),
    type: Yup.string().required('Type is required'),
  });


  return (
    <div className="kyc-verification-container">
      <div className="form">
        <Formik initialValues={{
          nationality: profile.nationality,
          firstName: profile.firstName,
          lastName: profile.lastName,
          gender: profile.gender,
          birthday: profile.birthday,
          idNumber: profile.idNumber,
          expiration: profile.expiration,
          type: profile.type,
        }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ isValid, values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <div className="id-container row justify-between border-bottom align-center pb-2">
                  <div className="step-title text-heading3">ID Type</div>
                  <div className="actions">
                    <CheckToggleButton title={'ID Card'} value={'id_cad'} selectedValue={values.type} setFieldValue={setFieldValue} />
                    <CheckToggleButton title={`Driver's licence`} value={'driver_licence'} selectedValue={values.type} setFieldValue={setFieldValue} />
                    <CheckToggleButton title={'Passport'} value={'passport'} selectedValue={values.type} setFieldValue={setFieldValue} />
                  </div>
                </div>
                <FormControl className="d-form-control" isInvalid={Boolean(errors.nationality && touched.nationality)}>
                  <TextField
                    name={'nationality'}
                    type={'select'}
                    label="Nationality"
                    options={COUNTRIES.sort((c1: any, c2: any) => {
                      if (c1.label < c2.label) return -1;
                      if (c1.label > c2.label) return 1;
                      return 0
                    })}
                    value={values.nationality}
                    isInvalid={Boolean(errors.nationality && touched.nationality)}
                    helperText={errors.nationality && touched.nationality ? String(errors.nationality) : undefined}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <div className="row">
                  <FormControl className="d-form-control" isInvalid={Boolean(errors.firstName && touched.firstName)}>
                    <TextField
                      name={'firstName'}
                      type={'text'}
                      label="First Name"
                      options={undefined}
                      value={values.firstName}
                      isInvalid={Boolean(errors.firstName && touched.firstName)}
                      helperText={errors.firstName && touched.firstName ? String(errors.firstName) : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                  <div className="padding-box" />
                  <FormControl className="d-form-control" isInvalid={Boolean(errors.lastName && touched.lastName)}>
                    <TextField
                      name={'lastName'}
                      type={'text'}
                      label="Last Name"
                      options={undefined}
                      value={values.lastName}
                      isInvalid={Boolean(errors.lastName && touched.lastName)}
                      helperText={errors.lastName && touched.lastName ? String(errors.lastName) : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                </div>
                <div className="row">
                  <FormControl className="d-form-control" isInvalid={Boolean(errors.gender && touched.gender)}>
                    <TextField
                      name={'gender'}
                      type={'select'}
                      label="Gender"
                      options={GENDER}
                      value={values.gender}
                      isInvalid={Boolean(errors.gender && touched.gender)}
                      helperText={errors.gender && touched.gender ? String(errors.gender) : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                  <div className="padding-box" />
                  <FormControl className="d-form-control" isInvalid={Boolean(errors.birthday && touched.birthday)}>

                    <TextField
                      name={'birthday'}
                      type={'date'}
                      label="Input your Birthday"
                      options={undefined}
                      calenderType={'birth'}
                      value={values.birthday}
                      isInvalid={Boolean(errors.birthday && touched.birthday)}
                      helperText={errors.birthday && touched.birthday ? String(errors.birthday) : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                </div>
                <div className="row">
                  <FormControl className="d-form-control" isInvalid={Boolean(errors.idNumber && touched.idNumber)}>
                    <TextField
                      name={'idNumber'}
                      type={'text'}
                      label="Enter your ID Number"
                      options={undefined}
                      value={values.idNumber}
                      isInvalid={Boolean(errors.idNumber && touched.idNumber)}
                      helperText={errors.idNumber && touched.idNumber ? String(errors.idNumber) : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                  <div className="padding-box" />
                  <FormControl className="d-form-control" isInvalid={Boolean(errors.expiration && touched.expiration)}>
                    <TextField
                      name={'expiration'}
                      type={'date'}
                      label="Input your Expiration Date"
                      options={undefined}
                      calenderType={'expiration'}
                      value={values.expiration}
                      isInvalid={Boolean(errors.expiration && touched.expiration)}
                      helperText={errors.expiration && touched.expiration ? String(errors.expiration) : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                </div>
                <div className='stage-actions'>
                  <button className="btn outlined text-gemunu text-body1" onClick={handleBack}>Back</button>
                  <Button className="btn contained text-gemunu text-body1" isDisabled={!isValid} type="submit">Next</Button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  );
};
export default BasicInfoStep;
