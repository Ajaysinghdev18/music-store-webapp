/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  Tabs,
  useToast
} from '@chakra-ui/core';
import classnames from 'classnames';
import { Country, countries } from 'countries-list';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CCS from 'countrycitystatejson';
import { useFormik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import * as Yup from 'yup';

import { UserApi } from '../../../../apis';
import {
  Address,
  Email2,
  GreenEyeIcon,
  GreenKYCIcon,
  GreenNext,
  GreenPencil,
  Mobile,
  Verified
} from '../../../../assets/icons';
import { Alert, AnimationOnScroll, IOption, Icon } from '../../../../components';
import { CustomCheckBox } from '../../../../components/CustomCheckBox';
import TextField from '../../../../components/TextField';
import { CURRENCIES, LANGUAGES, ROUTES } from '../../../../constants';
import { UserModel } from '../../../../shared/models';
import { setUser } from '../../../../store/actions';
import { getKYCDetails, getUser } from '../../../../store/selectors';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../utils/generaltittlefunction';
// Styles
import './styles.scss';

export const STATUS = {
  NOT_VERIFIED: 'not-verified',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  UNDER_VERIFICATION: 'under-verification'
};

// Constants
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const notificationSettings = [
  {
    name: 'Receipts',
    label: 'RECEIPTS FOR PURCHASE'
  },
  {
    name: 'Announcements',
    label: 'LISTING ANNOUNCEMENTS, NEW FEATURES, UPDATES AND REGULATION CHANGES'
  },
  {
    name: 'Promotions',
    label: 'LATEST PROMOTIONS AND SPECIAL OCCASION OFFERS'
  },
  {
    name: 'Blog',
    label: 'BLOG AND NEWSLETTER'
  }
];
const tabData = [
  {
    title: 'Account'
  },
  {
    title: 'Shipping Address'
  },
  {
    title: 'Security'
  },
  {
    title: 'Notification'
  },
  {
    title: 'Preference'
  }
];
enum SETTINGS_TAB {
  ACCOUNT,
  SHIPPING_ADDRESS,
  SECURITY,
  NOTIFICATIONS,
  PREFERENCES
}
interface ISettings {
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  addressLine: string;
  country: string;
  city: string;
  region: string;
  zip: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  currency: string;
  language: string;
}
interface ISecurity {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface ITextField {
  name: keyof ISettings;
  type?: 'text' | 'password' | 'select' | 'number' | 'tel';
  options?: IOption[];
  label: string;
}

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().required('Email is required').email('Email is not valid!'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  oldPassword: Yup.string()
    .matches(/[a-zA-Z]/, 'Password should contain at least one alphabet.')
    .matches(/\d/, 'Password should contain at least one number.')
    .min(8, 'Password should contain at least 8 characters.'),
  newPassword: Yup.string()
    .matches(/[a-zA-Z]/, 'Password should contain at least one alphabet.')
    .matches(/\d/, 'Password should contain at least one number.')
    .min(8, 'Password should contain at least 8 characters.'),
  confirmPassword: Yup.string()
    .matches(/[a-zA-Z]/, 'Password should contain at least one alphabet.')
    .matches(/\d/, 'Password should contain at least one number.')
    .min(8, 'Password should contain at least 8 characters.')
});

// Export settings tab
export const SettingsTab = () => {
  const [tabId, setTabId] = useState<number>(0);
  const [addressModalVisible, setAddressModalVisible] = useState<boolean>(false);
  const [mobileModalVisible, setMobileModalVisible] = useState<boolean>(false);
  const [emailModalVisible, setEmailModalVisible] = useState<boolean>(false);
  const [visible, setVisible] = useState<{
    oldPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
  }>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [initialValues, setInitialValues] = useState<ISettings>({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    addressLine: '',
    country: '',
    city: '',
    region: '',
    zip: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    currency: '',
    language: ''
  });

  // Get user from store
  const user = useSelector(getUser);
  const kycDetail = useSelector(getKYCDetails);
  // Get dispatch from hook
  const dispatch = useDispatch();

  // Get toast from hook
  const toast = useToast();
  const { t } = useTranslation();
  const history = useHistory();

  const [notifications, setNotifications] = useState<string[]>([]);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleSubmit: formikSubmit,
    isSubmitting,
    handleBlur
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      let addressLine1 = '';
      let addressLine2 = '';
      if (values.addressLine) {
        const addresses = values.addressLine.split(',');
        addressLine1 = addresses[0].trim() || '';
        if (addresses.length > 1) {
          addressLine2 = addresses[1].trim() || '';
        }
      }
      const newProfile = {
        name: values.name,
        email: values.email,
        username: values.username,
        phoneNumber: values.phoneNumber,
        notificationSettings: notifications,
        addressLine1,
        addressLine2,
        city: values.city,
        country: values.country,
        zip: values.zip,
        language: values.language,
        currency: values.currency,
        region: values.region
      };
      let password = null;

      if (values.oldPassword && values.newPassword) {
        password = {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword
        };
      }

      if (user?.id) {
        const updateProfileActions = [UserApi.updateProfile(user.id, newProfile)];

        if (password) {
          updateProfileActions.push(UserApi.updatePassword(user.id, password));
        }

        Promise.all(updateProfileActions)
          .then(() => {
            setSubmitting(false);

            const updatedUser = new UserModel({
              ...user,
              ...newProfile
            });
            dispatch(setUser(updatedUser));
            setAddressModalVisible(false);
            setMobileModalVisible(false);
            setEmailModalVisible(false);
            toast({
              position: 'top-right',
              render: ({ onClose }) => <Alert message="Successfully Updated" onClose={onClose} />
            });
          })
          .catch((err) => {
            const message = err.msg || 'Something went wrong';
            setSubmitting(false);
            toast({
              position: 'top-right',
              render: ({ onClose }) => <Alert message={message} color="red" onClose={onClose} />
            });
          });
      }
    }
  });

  const addressFields: ITextField[] = useMemo(
    () => [
      {
        name: 'addressLine',
        label: 'Address Line'
      },
      {
        name: 'country',
        label: 'Country',
        type: 'select',
        options: CCS.getCountries()
          .map(({ name, shortName }: any) => ({
            label: name,
            value: shortName
          }))
          .sort((c1: any, c2: any) => {
            if (c1.label < c2.label) return -1;
            if (c1.label > c2.label) return 1;
            return 0;
          })
      },
      {
        name: 'region',
        label: 'State/Region',
        type: 'select',
        options: CCS.getStatesByShort(values.country)
          ?.map((state: string) => ({
            label: state,
            value: state
          }))
          .sort((c1: any, c2: any) => {
            if (c1.label < c2.label) return -1;
            if (c1.label > c2.label) return 1;
            return 0;
          })
      },
      {
        name: 'city',
        label: 'City',
        type: 'select',
        options: CCS.getCities(values.country, values.region)
          ?.map((city: string) => ({
            label: city,
            value: city
          }))
          .sort((c1: any, c2: any) => {
            if (c1.label < c2.label) return -1;
            if (c1.label > c2.label) return 1;
            return 0;
          })
      },
      {
        name: 'zip',
        label: 'ZIP/Postal Code'
      }
    ],
    [values]
  );

  const notificationCheckHandler = (field: string, label: string) => {
    if (!notifications.includes(`${field}-${label}`)) {
      setNotifications([...notifications, `${field}-${label}`]);
    } else {
      setNotifications([...notifications.filter((item) => item !== `${field}-${label}`)]);
    }
  };

  const handleNotificationCheck = (field: string, label: string) => {
    return notifications.includes(`${field}-${label}`);
  };

  const securityFields: ITextField[] = [
    {
      name: 'oldPassword',
      type: 'password',
      label: 'Current Password'
    },
    {
      name: 'newPassword',
      type: 'password',
      label: 'New Password'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm New Password'
    }
  ];
  const preferenceFields: ITextField[] = [
    {
      name: 'currency',
      label: 'Currency',
      type: 'select',
      options: CURRENCIES
    },
    {
      name: 'language',
      label: 'Language',
      type: 'select',
      options: LANGUAGES
    }
  ];
  const mobileNumber: ITextField[] = [
    {
      name: 'phoneNumber',
      label: 'Mobile',
      type: 'number'
    }
  ];
  const emailAddress: ITextField[] = [
    {
      name: 'email',
      label: 'Email'
    }
  ];
  const handleSave = (formikSubmit: any) => {
    formikSubmit();
  };
  const handleToggleVisible = (field: keyof ISecurity) => () => {
    setVisible({
      ...visible,
      [field]: !visible[field]
    });
  };

  TabTitle('Settings - Digital Music Shopping Market Place');
  metaTagByTitle('Settings - Digital Music Shopping Market Place');
  metaTagByDesc(
    t('Common.Music-Store is founded on values we all share and are ready to stand for.') +
      ' ' +
      t('Common.They bring us together well beyond our current products and technologies.') +
      ' ' +
      t(
        'Common.They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
      )
  );
  metaTagByKey(t('Common.Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT'));
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  useEffect(() => {
    if (user) {
      setInitialValues({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        phoneNumber: user.phoneNumber || '',
        addressLine:
          (user?.addressLine2 && user.addressLine1?.concat(',', user?.addressLine2)) || user.addressLine1 || '',
        country: user.country ? user.country : '',
        city: user.city ? user.city : '',
        region: user.region ? user.region : '',
        zip: user.zip || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        currency: user.currency || '',
        language: user.language || ''
      });
      setNotifications(user.notificationSettings || []);
    }
  }, [user]);

  const handleClick = (path: string) => {
    history.push(path);
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const countryName = user ? countries[user?.country]?.name : null;
  const addressData: any = `${user?.addressLine1 ? `${user?.addressLine1}, ` : ''}
  ${user?.country ? `${countryName}, ` : ''}
  ${user?.region ? `${user?.region}, ` : ''}
  ${user?.city ? `${user?.city}, ` : ''}
  ${user?.zip ? `${user?.zip}.` : ''}`;

  const handleAddressCancel = () => {
    setFieldValue('country', user?.country);
    setFieldValue('region', user?.region);
    setFieldValue('city', user?.city);
    setFieldValue('zip', user?.zip);
    setFieldValue('addressLine', user?.addressLine1);
    setAddressModalVisible(false);
  };
  // Return setting tab
  return (
    <div className="profile-settings-tab">
      <form className="form-container" onSubmit={formikSubmit}>
        <Tabs className="tabs">
          {tabData.map((tab, index) => (
            <Tab
              key={`tab-${index}`}
              className={classnames('tab', {
                active: index === tabId
              })}
              onClick={() => setTabId(index)}
            >
              {t(`Settings.${tab.title}`)}
            </Tab>
          ))}
        </Tabs>
        {tabId === SETTINGS_TAB.ACCOUNT && (
          <div className="account-container">
            <div className="info-field">
              <div className="flex">
                <Avatar className="avatar" src={user?.avatar} />
                <div className="name-email">
                  <div className="name">{user?.name}</div>
                  <div className="email">{user?.email}</div>
                </div>
              </div>
              {user?.KYCStatus === STATUS.VERIFIED ? (
                <div className="flex">
                  <Verified />
                  <div className="typo-body text-green">{t(`Settings.Verified`)}</div>
                </div>
              ) : user?.KYCStatus === STATUS.UNDER_VERIFICATION ? (
                <div className="flex">
                  <div className="typo-body text-yellow">{t(`Settings.UnderVerification`)}</div>
                </div>
              ) : user?.KYCStatus === STATUS.REJECTED ? (
                <div className="flex">
                  <div className="typo-body text-yellow">{t(`Settings.KYCRejected`)}</div>
                </div>
              ) : (
                <div className="flex">
                  <div className="typo-body text-yellow">{t(`Settings.Verify`)}</div>
                </div>
              )}

              {user?.isKYCVerified ? (
                <GreenEyeIcon onClick={() => handleClick(ROUTES.KYC.CONFIRM)} className=" icon-btn" />
              ) : user?.KYCStatus === STATUS.UNDER_VERIFICATION ? (
                <div className="flex"></div>
              ) : (
                (user?.KYCStatus === STATUS.REJECTED || user?.KYCStatus === STATUS.NOT_VERIFIED) && (
                  <div className="outlined-btn icon-btn" onClick={() => handleClick(ROUTES.KYC.INDEX)}>
                    <div className="text-green btn-text">{t(`Settings.Verify`)}</div>
                    <GreenNext className="btn-icon" />
                  </div>
                )
              )}
            </div>

            <div className="info-field">
              <div className="flex">
                <Email2 className="icon" />
                <div className="typo-body">{t('Settings.Email')}</div>
              </div>
              <div className="flex">
                <GreenKYCIcon />
                <div className="typo-body text-green">{user?.email}</div>
              </div>
              <div className="flex"></div>
            </div>

            <div className="info-field">
              <div className="flex">
                <Mobile className="icon" />
                <div className="typo-body">{t(`Settings.Mobile`)}</div>
              </div>
              <div className="flex">
                {user?.phoneNumber === '' ? (
                  <div className="typo-body text-green">Not Set</div>
                ) : (
                  <>
                    <GreenKYCIcon />
                    <div className="typo-body text-green">{user?.phoneNumber}</div>
                  </>
                )}
              </div>
              <GreenPencil onClick={() => setMobileModalVisible(true)} className=" icon-btn" />
            </div>
            <div className="info-field">
              <div className="flex">
                <Address />
                <div className="typo-body">{t(`Settings.Address`)}</div>
              </div>
              <div className="flex">
                <div className="typo-body text-white">{addressData}</div>
              </div>
              <GreenPencil onClick={() => setAddressModalVisible(true)} className=" icon-btn" />
            </div>
          </div>
        )}
        {tabId === SETTINGS_TAB.SHIPPING_ADDRESS && (
          <AnimationOnScroll animation="animate__slideInRight" isSubElement>
            <div className="form-group" style={{ height: '500px' }}>
              {addressFields.map(({ name, type, label, options }, index) => (
                <TextField
                  key={index}
                  name={name}
                  type={type}
                  label={t(`Settings.${label}`)}
                  options={options}
                  value={values[name]}
                  isInvalid={Boolean(errors[name] && touched[name])}
                  helperText={errors[name] && touched[name] ? String(errors[name]) : undefined}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              ))}
            </div>
          </AnimationOnScroll>
        )}
        {tabId === SETTINGS_TAB.SECURITY && (
          <AnimationOnScroll animation="animate__slideInRight" isSubElement>
            <div className="form-group" style={{ height: '500px' }}>
              {securityFields.map(({ name, type, label }, index) => (
                <TextField
                  key={index}
                  name={name}
                  type={type}
                  label={t(`Settings.${label}`)}
                  value={values[name]}
                  visiblePassword={visible[name as keyof ISecurity]}
                  isInvalid={Boolean(errors[name] && touched[name])}
                  helperText={errors[name] && touched[name] ? String(errors[name]) : undefined}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onToggleVisiblePassword={handleToggleVisible(name as keyof ISecurity)}
                />
              ))}
            </div>
          </AnimationOnScroll>
        )}
        {tabId === SETTINGS_TAB.NOTIFICATIONS && (
          <AnimationOnScroll animation="animate__slideInRight" isSubElement>
            <table className="notification-table" style={{ height: '500px' }}>
              <thead>
                <tr>
                  <td>Notifications</td>
                  <td align="right">
                    <div className="head-label">
                      <Icon name="desktop-mac" />
                      <span>In App</span>
                    </div>
                  </td>
                  <td align="right">
                    <div className="head-label">
                      <Icon name="email" />
                      <span>{t('Auth.Email')}</span>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                {notificationSettings.map(({ name, label }, index) => (
                  <tr key={index}>
                    <td>
                      <h6>{t(`Settings.${name}`)}</h6>
                      <span className="description">{t(`Settings.${label}`)}</span>
                    </td>
                    <td align="right">
                      <div className="head-label">
                        <CustomCheckBox
                          isCheck={handleNotificationCheck('app', name)}
                          toggleCheck={() => notificationCheckHandler('app', name)}
                        />
                      </div>
                    </td>
                    <td align="right">
                      <div className="head-label">
                        <CustomCheckBox
                          isCheck={handleNotificationCheck('email', name)}
                          toggleCheck={() => notificationCheckHandler('email', name)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AnimationOnScroll>
        )}
        {tabId === SETTINGS_TAB.PREFERENCES && (
          <AnimationOnScroll animation="animate__slideInRight" isSubElement>
            <div className="form-group" style={{ height: '500px' }}>
              {preferenceFields.map(({ name, label, type, options }, index) => (
                <TextField
                  key={index}
                  name={name}
                  type={type}
                  label={t(`Settings.${label}`)}
                  options={options}
                  value={values[name]}
                  isInvalid={Boolean(errors[name] && touched[name])}
                  helperText={errors[name] && touched[name] ? String(errors[name]) : undefined}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              ))}
            </div>
          </AnimationOnScroll>
        )}
        <div>
          {tabId !== SETTINGS_TAB.ACCOUNT && (
            <Button className="d-button account-button d-block ml-auto" type="submit" isLoading={isSubmitting}>
              {t(`Settings.Save Changes`)}
            </Button>
          )}
        </div>
        <Modal isOpen={addressModalVisible} onClose={() => setAddressModalVisible(false)}>
          <ModalOverlay />
          <ModalContent background={'black'} width={'50%'} maxW={'50%'} top={'30%'}>
            <ModalHeader color={'white'} fontSize={45}>
              {' '}
              Change Address
            </ModalHeader>
            <ModalBody>
              {addressFields.map(({ name, type, label, options }, index) => (
                <TextField
                  key={index}
                  name={name}
                  type={type}
                  label={t(`Settings.${label}`)}
                  options={options}
                  value={values[name]}
                  isInvalid={Boolean(errors[name] && touched[name])}
                  helperText={errors[name] && touched[name] ? String(errors[name]) : undefined}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              ))}
            </ModalBody>

            <ModalFooter>
              <Button className="d-outlined-button" onClick={handleAddressCancel} mr={10}>
                Cancel
              </Button>
              <Button className="d-button" type="button" onClick={() => handleSave(formikSubmit)}>
                Change
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={mobileModalVisible} onClose={() => setMobileModalVisible(false)}>
          <ModalOverlay />
          <ModalContent background={'black'} width={'50%'} maxW={'50%'} top={'30%'}>
            <ModalHeader color={'white'} fontSize={45}>
              {t('Settings.Change Mobile Number')}
            </ModalHeader>
            <ModalBody>
              {mobileNumber.map(({ name, label, type }, index) => (
                <TextField
                  name={name}
                  label={t(`Settings.${label}`)}
                  value={values[name]}
                  type={type}
                  isInvalid={Boolean(errors[name] && touched[name])}
                  helperText={errors[name] && touched[name] ? String(errors[name]) : undefined}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              ))}
            </ModalBody>

            <ModalFooter>
              <Button
                className="d-outlined-button"
                type="button"
                onClick={() => {
                  setFieldValue('phoneNumber', user?.phoneNumber);
                  setMobileModalVisible(false);
                }}
                mr={10}
              >
                Cancel
              </Button>
              <Button className="d-button" type="button" onClick={() => handleSave(formikSubmit)}>
                Change
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </form>
    </div>
  );
};
