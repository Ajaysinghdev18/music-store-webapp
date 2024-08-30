import React  from 'react';
import './style.scss';

export interface ICalendarBodyProps {
    yearProp?: number,
    monthProp?: number,
    daysProp?: number,
    weekdayProp?: number,
    setDayCallback: (day: number) => void
}

function CalendarBody ({
   yearProp = new Date().getFullYear(),
   monthProp = new Date().getMonth(),
   daysProp = 31,
   weekdayProp = new Date().getDay(),
   setDayCallback ,
}: ICalendarBodyProps) {
    const maxItemCount: number = Math.ceil((weekdayProp + daysProp) / 7) * 7;
    const blankItems: number[] = Array<number>(weekdayProp).fill(0);
    const dayItems: number[] = Array<number>(daysProp).fill(0);
    const remItems: number[] = Array<number>(maxItemCount - (weekdayProp + daysProp)).fill(0);
    
    const onSelectDay = (event: any, day: number): void => {
        event.preventDefault();
        setDayCallback(day);
    }
    
    const isCurrentDay = (index: number) => {
        return (
          new Date().getFullYear() === yearProp &&
          new Date().getMonth() === monthProp &&
          index + 1 === new Date().getDate()
        );
      };
    
    return (
        <div className="calendar-body">
            { blankItems.map((item, index) => <div key={`blankItem-${index}`} />)  }
            { dayItems.map((item, index) =>
                <div key={`dayItem-${index}`}
                     className={`day-item ${isCurrentDay(index) ? 'current-day' : ''}`}
                     onClick={(e: any) => onSelectDay(e, index + 1)}
                >
                    {index + 1}
                </div>
            )}
            { remItems.map((item, index) => <div key={`remItem-${index}`} /> )}
        </div>
    );
}

export default CalendarBody;

