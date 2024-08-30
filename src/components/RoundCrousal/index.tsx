import React from 'react';
import './Carousel.scss'

export const RoundCrousal = ({ images }: any ) => {
  return (
    <div className="container">
      <div id="carousel">
        {images.map((image:string)=>{
          return(
            <figure><img src={image} height={'100%'}  width={'100%'} style={{objectFit:'contain'}} alt=""/></figure>
          )
        })}
      </div>
    </div>
  );
};

