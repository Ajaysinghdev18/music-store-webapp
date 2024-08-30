import React, { useEffect, useState } from 'react';
import { Cancel, GreenAddress } from '../../../assets/icons';
import { useHistory } from 'react-router';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import TextField from '../../../components/TextField';
import './style.scss';
import { Icon, Select } from '../../../components';
import { CITIES, COUNTRIES } from '../../../constants';

const validationSchema = Yup.object().shape({
  address1: Yup.string().required('SUPPORTING TEXT'),
  address2: Yup.string().required('SUPPORTING TEXT'),
  country: Yup.string().required('SUPPORTING TEXT'),
  city: Yup.string().required('SUPPORTING TEXT'),
  region: Yup.string().required('SUPPORTING TEXT'),
  zip: Yup.string().required('SUPPORTING TEXT'),
});

const KYCAddressChangePage = () => {
  const history = useHistory();
  const [countryValue, setCountryValue] = useState('')
  const [suggestions, setSuggestions] = useState(COUNTRIES)
  const [visibleOptions, setVisibleOptions] = useState(false);
  const handleSubmit = () => {
    return;
  }
  const handleCountrySearch = (value: any) => {
    setCountryValue(value.target.value);
    setVisibleOptions(true);
  }

  useEffect(() => {
    // Filter countries based on the search term
    const filteredCountries = COUNTRIES.filter((country) =>
      country.label.toLowerCase().includes(countryValue.toLowerCase())
    );
    console.log("🚀 ~ file: index.tsx:35 ~ useEffect ~ filteredCountries:", filteredCountries)
    setSuggestions(filteredCountries);
  }, [countryValue]);

  return (
    <div className="address-change-container">
      <div className="address-change-dialog">
        <Cancel className="cancel-btn" onClick={() => history.go(-1)} />
        <div className="address-change-header">
          <GreenAddress />
          <div className="address-change-title">Change Address</div>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            address1: '',
            address2: '',
            country: '',
            city: '',
            region: '',
            zip: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => {
            return (
              <Form className="address-change-content">
                <div className="row justify-between full-width">
                  <div className="address-1">
                    <TextField
                      type='text'
                      value={values['address1']}
                      label='ADDRESS LINE 1'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={Boolean(errors.address1 && touched.address1)}
                      helperText={errors.address1 && touched.address1 ? String(errors.address1) : undefined}
                      name='address1'
                      handleText={'SEND CODE'}
                    />
                  </div>
                  <div className="address-2">
                    <TextField
                      type='text'
                      value={values['address2']}
                      label='ADDRESS LINE 2'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={Boolean(errors.address2 && touched.address2)}
                      helperText={(errors.address2 && touched.address2) ? String(errors.address2) : undefined}
                      name='address2'
                      handleText={'SEND CODE'}
                    />
                  </div>
                </div>
                <div className="row justify-between full-width">
                  <div className="country">
                    {/* <Select
                      options={COUNTRIES}
                      value={values.country}
                      onChange={(val) => setFieldValue('country', val)}
                      placeholder={'COUNTRY'}
                      isInvalid={Boolean(errors.country && touched.country)}
                      className="select-country"
                      type={'type2'}
                    /> */}
                    <TextField
                      type={'text'}
                      name={'country'}
                      value={countryValue}
                      label={'COUNTRY'}
                      isInvalid={Boolean(errors.country && touched.country)}
                      helperText={(errors.country && touched.country ? errors.country : undefined)}
                      onChange={(e) => handleCountrySearch(e)}
                    />
                    {visibleOptions && (
                      <div className="d-options">
                        {suggestions.map(({ label, value: v }, index) => (
                          <p key={index} className="d-option text-heading4" onClick={() => {
                            setCountryValue(label);
                            setFieldValue('country', v);
                            setVisibleOptions(false);
                          }}>
                            {label}
                          </p>
                        ))}
                        {/* <Icon name="arrow-up" /> */}
                      </div>
                    )}
                  </div>

                  <div className="city">
                    <Select
                      options={CITIES}
                      value={values.city}
                      onChange={(val) => setFieldValue('city', val)}
                      placeholder={'CITY'}
                      isInvalid={Boolean(errors.city && touched.city)}
                      className="select-city"
                      type={'type2'}
                    />
                  </div>
                </div>
                <div className="row justify-between full-width">
                  <div className="region">
                    <TextField
                      type={'text'}
                      name={'region'}
                      value={values.region}
                      label={'STATE/REGION'}
                      isInvalid={Boolean(errors.region && touched.region)}
                      helperText={(errors.region && touched.region ? errors.region : undefined)}
                      onChange={handleChange} onBlur={handleBlur}
                    />
                  </div>
                  <div className="zip">
                    <TextField
                      type={'text'}
                      name={'zip'}
                      value={values.zip}
                      label={'ZIP/POSTAL CODE'}
                      isInvalid={Boolean(errors.zip && touched.zip)}
                      helperText={(errors.zip && touched.zip ? errors.zip : undefined)}
                      onChange={handleChange} onBlur={handleBlur}
                    />
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
        <div className="address-change-footer">
          <button className="address-change-action-contained">
            Save Changes
          </button>
          <button className="address-change-action-outlined" onClick={() => history.go(-1)}>Discard</button>
        </div>
      </div>
    </div>
  );
}

export default KYCAddressChangePage;
