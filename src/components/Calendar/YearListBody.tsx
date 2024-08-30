import React, { useEffect } from 'react';
import './style.scss';

export interface IYearListBody {
  yearProp?: number;
  setYearCallback?: (year: number) => void;
}

function YearListBody({
  yearProp = new Date().getFullYear(),
  setYearCallback = () => { },
}: IYearListBody) {
  const items = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    console.log(yearProp);
  }, [yearProp]);

  const setYear = (year: number) => {
    setYearCallback(year);
  };
console.log('items', items)
  return (
    <div className="year-list">

      {items.sort((a,b)=> b-a).map((item, index) => (
        <div
          key={`listItem-${index + 12}`}
          className="day-list color-white"
          onClick={() => setYear(yearProp - item)}
        >
          {yearProp - item}
        </div>
      ))}
      <div
        className="current-year color-white"
        onClick={() => setYear(yearProp)}
      >
        {yearProp}
      </div>

      {items.slice(0, 12).sort((a,b)=> a-b).map((item, index) => (
        <div
          key={`listItem-${index}`}
          className="day-list color-white"
          onClick={() => setYear(yearProp + item)}
        >
          {yearProp + item}
        </div>
      ))}

    </div>
  );
}

export default YearListBody;

