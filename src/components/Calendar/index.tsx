import React, { useEffect, useState } from 'react';

import MonthYearBar from "./MonthYearBar";
import CalendarHead from "./CalendarHead";
import CalendarBody from "./CalendarBody";
import YearListBody from "./YearListBody";
import './style.scss';

export interface IRCCalendarProps {
  dateProp?: Date | null,
  selectDate: (date: Date, visible: boolean) => void
  type?: 'expiration' | 'birth' | 'basic';
}

function Calendar({
  dateProp,
  selectDate,
  type = 'basic'
}: IRCCalendarProps) {

  const [currentDate, setCurrentDate] = useState<Date | null | undefined>(dateProp ? dateProp : new Date());
  const [isYearSetListShow, setIsYearSetListShow] = useState<boolean>(false);

  const setCurrentYear = (_currentYear: number) => {
    const _currentMonth = currentDate?.getMonth();
    const _currentDay = currentDate?.getDate();
    const visible = true;
  
    if (_currentDay !== undefined && _currentMonth !== undefined) {
      const newDate = new Date(_currentYear, _currentMonth, _currentDay);
  
      if (type === 'expiration' && newDate >= new Date()) {
        setCurrentDate(newDate);
        selectDate(new Date(_currentYear, _currentMonth + 1, _currentDay), visible);
      } else if (type === 'birth' && newDate <= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
        setCurrentDate(new Date(_currentYear, _currentMonth + 1, _currentDay));
        selectDate(new Date(_currentYear, _currentMonth + 1, _currentDay), visible);
      }
    }
  
    setIsYearSetListShow(false);
  };

  const getCurrentYear = (): number => {
    if (currentDate) {
      return currentDate.getFullYear();
    }
    return 0;
  }

  const setCurrentMonth = (_currentMonth: number) => {
    const _currentYear = currentDate?.getFullYear();
    const _currentDay = currentDate?.getDate();
    const visible = true;
    _currentYear && _currentDay && setCurrentDate(new Date(_currentYear, _currentMonth, _currentDay));
    _currentYear && _currentDay && selectDate(new Date(_currentYear, _currentMonth + 1, _currentDay), visible);
  }

  const getCurrentMonth = (): number => {
    return currentDate?.getMonth() || 0;
  }
 
const setCurrentDay = (_currentDay: number) => {
  const _currentYear: any = currentDate?.getFullYear( );
  const _currentMonth: any = currentDate?.getMonth();
  const _currentDate = new Date(_currentYear || 0, (_currentMonth || 0) + 1, _currentDay);
  const today = new Date();

  if (type === 'expiration' && _currentDate) {
    const validDate = _currentDate >= today;
    const visible = false;

    if (validDate) {
      setCurrentDate(new Date(_currentYear, _currentMonth, _currentDay));
      selectDate(new Date(_currentYear, _currentMonth, _currentDay), visible);
    }
  }

  if (type === 'birth' && _currentDate) {
    const limitDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (_currentDate <= limitDate) {
      const visible = false;
      setCurrentDate(new Date(_currentYear, _currentMonth + 1, _currentDay));
      selectDate(new Date(_currentYear, _currentMonth + 1, _currentDay), visible);
    }
  }
};

  const isSetYearList = () => {
    setIsYearSetListShow(!isYearSetListShow);
  }

  const getMonthDays = (): number => {
    const monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const currentYear: number = getCurrentYear();
    const currentMonth: number = getCurrentMonth();
    if (isCurrentLinearYear(currentYear)) {
      monthDays[currentMonth] = 29;
    }
    return monthDays[currentMonth];
  }

  const getCurrentWeekday = (): number => {
    const firstDayOfMonth: Date = new Date(currentDate?.getFullYear() || new Date().getFullYear(), currentDate?.getMonth() || new Date().getMonth(), 1);
    return firstDayOfMonth.getDay();
  }

  const isCurrentLinearYear = (_currentYear: number): boolean => {
    if (_currentYear % 400 === 0) {
      return true;
    } else if (_currentYear % 400 !== 0 && _currentYear % 100 === 0) {
      return true;
    } else if (_currentYear % 100 !== 0 && _currentYear % 4 === 0) {
      return true;
    }
    return false;
  }

  return (
    <div className="calendar-container">
      <MonthYearBar
        yearProp={getCurrentYear()}
        monthProp={getCurrentMonth()}
        setYearCallback={setCurrentYear}
        setMonthCallback={setCurrentMonth}
        isSetYearList={isSetYearList}
      />
      {!isYearSetListShow && <CalendarHead />}
      <div className="divider" />
      {!isYearSetListShow && (
        <CalendarBody
          yearProp={getCurrentYear()}
          monthProp={getCurrentMonth()}
          daysProp={getMonthDays()}
          weekdayProp={getCurrentWeekday()}
          setDayCallback={(d) => setCurrentDay(d)}
        />)}
      {
        isYearSetListShow && (
          <YearListBody
            yearProp={getCurrentYear()}
            setYearCallback={setCurrentYear}

          />
        )
      }
      <div className="pointer-triangle"></div>

    </div>
  );
}

export default Calendar;

