import React, { ChangeEvent, FC, useEffect, useState, useRef, useMemo } from 'react';
import { FormControl, FormHelperText, FormLabel, Input, InputGroup, InputRightElement } from '@chakra-ui/core';
import useOnClickOutside from '../OutSideClickHandler';
import './styles.scss';
import classnames from 'classnames';
import { Icon } from '../Icon';
import Calendar from '../Calendar';
import moment from 'moment';

export interface IOption {
  label: string;
  value: any;
}
interface ITextFieldProps {
  name?: string;
  value: string;
  label: string;
  isInvalid?: boolean;
  helperText?: string;
  type?: 'text' | 'password' | 'select' | 'date' | 'number' | 'tel';
  visiblePassword?: boolean;
  options?: IOption[];
  onChange?: (e: ChangeEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onToggleVisiblePassword?: () => void;
  handleText?: string;
  calenderType?: 'expiration' | 'birth' | 'basic';
}

const TextField: FC<ITextFieldProps> = ({
  type = 'text',
  name,
  value,
  label,
  options,
  isInvalid,
  helperText,
  visiblePassword,
  onChange,
  onBlur,
  onToggleVisiblePassword,
  handleText,
  calenderType='basic'
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IOption>();
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const [filteredOptions, setFilteredOptions] = useState<IOption[]>([])
  const [visibleOptions, setVisibleOptions] = useState<boolean>(false);

  const nationalityRef = useRef<HTMLDivElement>(null);
  const birthRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(options){
      setFilteredOptions(options)
    }
  },[options])
  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleClick = () => {
    setVisibleOptions(!visibleOptions);
    setFocused(!focused);
  };

  const handleSelect = (value: IOption) => {
    if (onChange)
     {
      onChange({
        currentTarget: {
          name: name,
          value: value.value
        }
      } as unknown as ChangeEvent);
      }
    setSelectedItem(value);
    setFocused(false);
    setVisibleOptions(false);
  };
  const handleSelectDate = (date: Date, visible: boolean) => {
    if (date) {
      setSelectedDate(date);
    }
    setVisibleOptions(visible);
    if (onChange)
      onChange({
        currentTarget: {
          name: name,
          value: date
        }
      } as unknown as ChangeEvent);
    setFocused(false);
  }

  useEffect(() => {
    const item = options?.find(({ value: v }) => value === v);
    setSelectedItem(item? item : {value: "", label:""});
    if (value) setSelectedDate(new Date(value));
  }, [value, options]);

  const getFullDate = (date: Date | undefined | null) => {
    if (date) {
      return moment(date).format('YYYY/MM/DD');
    }
    return
  }

  useOnClickOutside(nationalityRef, () => {
    setVisibleOptions(false);
    setFocused(false);
  });

  useOnClickOutside(birthRef, () => {
    setVisibleOptions(false);
    setFocused(false);
  });

  const handleSearch = (value: any) => {
    setSelectedItem({label:value, value: value})
    if(options){
      setVisibleOptions(true)
      setFilteredOptions(options?.filter(item => item.label.toLowerCase().indexOf(value.toLocaleLowerCase()) > -1).sort((a, b) => {
        const fa = a.label.toLowerCase(),
            fb = b.label.toLowerCase();
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    }))
    }
  }

  return (
    <FormControl
      className={classnames('d-text-field', {
        'd-text-field--empty': !focused && !value,
        'd-text-field--error': isInvalid,
        'd-text-field--focused': focused
      })}
      isInvalid={isInvalid}
    >
      <div className="form-filled-wrapper">
        <FormLabel className="form-label text-body1">{label}</FormLabel>
        {type === 'select' && (
          <div ref={nationalityRef}>
            <InputGroup  onClick={handleClick}>
              <input
                className={classnames('form-input form-select-input text-body1')}
                autoComplete='off'
                onChange={(e)=>{
                  handleSearch(e.target.value)
                }}
                value={selectedItem?.label}
                onBlur={handleBlur} />
              <InputRightElement className="form-right-element">
                <Icon name="arrow-drop-down" />
              </InputRightElement>
            </InputGroup>
            {visibleOptions && filteredOptions && (
              <div className="form-select-options">
                {filteredOptions.map((item, index) => (
                  <div key={index} className="form-select-option" onClick={() => handleSelect(item)}>
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {type === 'date' && (
          <div ref={birthRef}>
            <InputGroup>
              <div className="form-select-input text-body1" onClick={handleClick} onBlur={handleBlur}>
                {getFullDate(selectedDate)}
              </div>
              <InputRightElement className="form-right-element">
                <Icon name="arrow-drop-down" />
              </InputRightElement>
            </InputGroup>
            {visibleOptions && (
              <Calendar 
              type={calenderType} 
              selectDate={handleSelectDate} dateProp={selectedDate ? new Date(selectedDate) : new Date()} />
            )}
          </div>
        )}
        {type !== 'select' && type !== 'date' && (
          // <InputGroup style={{marginTop: "-12px"}}>
          <InputGroup>
            <Input
              name={name}
              autoComplete='off'
              value={value}
              className={classnames('form-input text-body1', { 'with-right-element': onToggleVisiblePassword })}
              type={visiblePassword ? 'text' : type === 'password' ? 'password' : type}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {onToggleVisiblePassword && (
              <InputRightElement className="form-right-element" onClick={onToggleVisiblePassword}>
                <Icon name={visiblePassword ? 'eye-off' : 'eye'} />
              </InputRightElement>
            )}
            {
              handleText && <div className="handle-text text-body1">
                {handleText}
              </div>
            }
          </InputGroup>
        )}
      </div>
      <FormHelperText className="form-helper-text text-body1">{helperText}</FormHelperText>
    </FormControl>
  );
};

export default TextField;
