// Dependencies
import React, { useEffect } from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

// Styles
import './styles.scss';

// Vendor
// const wNumb = require('../../assets/vendors/wNumb');

// Interfaces
interface ISliderProps {
  range: number[];
  onChange: (values: number[]) => void;
  min: number;
  max: number;
  setPriceRange?: any
}

// Export slider component
export const Slider: React.FC<ISliderProps> = ({ range , setPriceRange, onChange, min, max }) => {
  // Init slider
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const slider = document.getElementById('d-slider') as noUiSlider.Instance;

    if (!slider) return;

    // Create slider
    if (!slider.classList.contains('noUi-target')) {
      noUiSlider.create(slider, {
        start: range,
        connect: [false, true, false],
        tooltips: false,
        behaviour: 'tap',
        // format: wNumb({
        //   decimals: 0,
        //   prefix: '$'
        // }),
        keyboardSupport: true,
        step: 1,
        direction: 'ltr',
        range: { min, max }
      });
    }
    slider.noUiSlider.on('change', (values: any) => {
      // Handle the change event
      setPriceRange([values[0], values[1]])
      onChange([values[0], values[1]]);
    });
    // Add action to slider module
    // slider.noUiSlider.on('update', function (values: any) {
    //   const minValue = Number.parseInt(values[0].slice(1));
    //   const maxValue = Number.parseInt(values[1].slice(1));
    //   if (minValue !== range[0] || maxValue !== range[1]) {
    //     onChange([minValue, maxValue]);
    //   }
    // });
    // eslint-disable-next-line
  }, []);

  // Return slider component
  return <div id="d-slider" className="d-slider" />;
};
