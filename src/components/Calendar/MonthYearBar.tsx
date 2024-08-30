import React, { useState } from 'react';
import './style.scss';

export interface IMonthYearBarProps {
    yearProp?: number,
    monthProp?: number,
    setYearCallback?: (year: number) => void,
    setMonthCallback?: (month: number) => void,
    isSetYearList?: () => void
}

function MonthYearBar ({
    yearProp = new Date().getFullYear(),
    monthProp = new Date().getMonth(),
    setYearCallback = () => {},
    setMonthCallback = () => {},
    isSetYearList = () => {},
}: IMonthYearBarProps) {
    
    
    const [isMonthListShow, setIsMonthListShow] = useState<boolean>(false);
    const monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const onMonthPrev = (event: any): void => {
        event.preventDefault();
        setMonthCallback(monthProp - 1);
    }
    
    const onMonthNext = (event: any): void => {
        event.preventDefault();
        setMonthCallback(monthProp + 1);
    }
    
    const onYearPrev = (event: any): void => {
        event.preventDefault();
        setYearCallback(yearProp - 1);
    }
    
    const onYearNext = (event: any): void => {
        event.preventDefault();
        setYearCallback(yearProp + 1);
    }
    
    const monthsDropDown = (month: string) => {
        setIsMonthListShow(prevState => !prevState);
    }
    
    const setMonth = (id: number) => {
        setMonthCallback(id);
        setIsMonthListShow(false);
    }

    return (
        <div className="month-year-bar">
            <div className="month-bar">
                <span onClick={onMonthPrev}>&lsaquo;</span>
                <div onClick={() => monthsDropDown(monthNames[monthProp])}>
                    <p className="color-white">{monthNames[monthProp]} <span>&#x25BE;</span></p>
                </div>
                <span onClick={onMonthNext}>&rsaquo;</span>
                {
                    isMonthListShow && <div className="months-list">
                        {monthNames.map((month, id) => (
                          <div key={month} className="month color-white" onClick={() => setMonth(id - 1)}>{month}</div>
                        ))}
                    </div>
                }
            </div>
            <div className="year-bar">
                <span onClick={onYearPrev}>&lsaquo;</span>
                <div onClick={isSetYearList}>
                    <p>{yearProp} <span>&#x25BE;</span></p>
                </div>
                <span onClick={onYearNext}>&rsaquo;</span>
            </div>
        </div>
    );
}

export default MonthYearBar;

