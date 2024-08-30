import React from 'react';
import './style.scss';

function CalendarHead () {
    const weekdays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="calendar-head">
            {weekdays.map((item: string, index: number) =>
                <div key={`${item}-${index}`} className="color-white">{item}</div>
            )}
        </div>
    );
}

export default CalendarHead;
