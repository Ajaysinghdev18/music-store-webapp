// Dependencies
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';

// Utils
import { getRandomGradientColors } from '../../utils';

// Interfaces
import { IShopHistory } from '../../shared/interfaces';

interface IChartProps {
  data: IShopHistory[];
}

// Dimensions
const width = 320;
const height = 320;
const defaultSize = 162;
const defaultStrokeWidth = 22;
const defaultLineWidth1 = 55;
const defaultLineWidth2 = 65;
const defaultFontSize = 9;
const defaultTextMargin = 5;

// Export chart component
export const Chart: FC<IChartProps> = ({ data }) => {
  // States
  const [dimension, setDimension] = useState({
    width,
    height
  });

  // Refs
  const chartRef = useRef<SVGSVGElement>(null);

  // Calc ratio from svg dimension
  const ratio = useMemo(() => dimension.width / width, [dimension]);

  // Calc chart dimensions from ratio
  const size = useMemo(() => ratio * defaultSize, [ratio]);
  const strokeWidth = useMemo(() => ratio * defaultStrokeWidth, [ratio]);
  const lineWidth1 = useMemo(() => ratio * defaultLineWidth1, [ratio]);
  const lineWidth2 = useMemo(() => ratio * defaultLineWidth2, [ratio]);
  const fontSize = useMemo(() => ratio * defaultFontSize, [ratio]);
  const textMargin = useMemo(() => ratio * defaultTextMargin, [ratio]);

  // Calc coordinate from svg dimension
  const coordinate = useMemo(
    () => ({
      x: dimension.width / 2,
      y: (height * ratio) / 2
    }),
    [dimension, ratio]
  );

  // Calc chart radius
  const outerRadius = size / 2;
  const innerRadius = outerRadius - strokeWidth;

  // Get chart drawing data
  const totalPrice = data.map(({ price }) => price).reduce((t = 0, p) => t + p);
  const percentData = data.map(({ price, ...rest }, index) => {
    const percent = price / totalPrice;
    const alpha = 359.95 * percent * (Math.PI / 180);
    const startAlpha =
      index === 0
        ? 0
        : 359.95 *
          data
            .map(({ price }) => price / totalPrice)
            .filter((_, i) => i < index)
            .reduce((t = 0, n) => t + n) *
          (Math.PI / 180);
    const endAlpha = alpha + startAlpha;
    const middleAlpha = alpha / 2 + startAlpha;

    const startCoordinate1 = {
      x: coordinate.x + outerRadius * Math.sin(startAlpha),
      y: coordinate.y - outerRadius * Math.cos(startAlpha)
    };

    const endCoordinate1 = {
      x: coordinate.x + outerRadius * Math.sin(endAlpha),
      y: coordinate.y - outerRadius * Math.cos(endAlpha)
    };

    const startCoordinate2 = {
      x: coordinate.x + innerRadius * Math.sin(startAlpha),
      y: coordinate.y - innerRadius * Math.cos(startAlpha)
    };

    const endCoordinate2 = {
      x: coordinate.x + innerRadius * Math.sin(endAlpha),
      y: coordinate.y - innerRadius * Math.cos(endAlpha)
    };

    const lineStartCoordinate = {
      x: coordinate.x + outerRadius * Math.sin(middleAlpha),
      y: coordinate.y - outerRadius * Math.cos(middleAlpha)
    };

    const lineMiddleCoordinate = {
      x: coordinate.x + (outerRadius + lineWidth1 * Math.abs(Math.cos(middleAlpha))) * Math.sin(middleAlpha),
      y: coordinate.y - (outerRadius + lineWidth1 * Math.abs(Math.cos(middleAlpha))) * Math.cos(middleAlpha)
    };

    const isRight = lineMiddleCoordinate.x > coordinate.x;

    const lineEndCoordinate = {
      x: lineMiddleCoordinate.x + (isRight ? 1 : -1) * lineWidth2,
      y: lineMiddleCoordinate.y
    };

    return {
      alpha,
      startCoordinate1,
      endCoordinate1,
      startCoordinate2,
      endCoordinate2,
      lineStartCoordinate,
      lineMiddleCoordinate,
      lineEndCoordinate,
      isRight,
      total: price,
      ...rest
    };
  });

  // Init chart dimension
  const initializeSize = () => {
    if (chartRef.current) {
      const parent = chartRef.current.parentElement;

      if (parent) {
        setDimension({
          width: parent.clientWidth,
          height: parent.clientHeight
        });
      }
    }
  };

  // On mounted
  useEffect(() => {
    initializeSize();

    window.onresize = () => {
      initializeSize();
    };

    return () => {
      window.onresize = null;
    };
  }, []);

  // Return chart component
  return (
    <svg ref={chartRef} width={dimension.width} height={height * ratio}>
      <defs>
        {percentData.map(({ alpha, startCoordinate1, endCoordinate1 }, index) => {
          const randomGradientColors = getRandomGradientColors();
          return (
            <linearGradient
              key={index}
              id={`grad-${index}`}
              x1={startCoordinate1.x}
              y1={startCoordinate1.y}
              x2={endCoordinate1.x}
              y2={endCoordinate1.y}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={randomGradientColors[0]} stopOpacity={1} />
              <stop
                offset="100%"
                stopColor={alpha > 6.1 ? randomGradientColors[0] : randomGradientColors[1]}
                stopOpacity={1}
              />
            </linearGradient>
          );
        })}
      </defs>
      {percentData.map(
        ({ _id: date, count, total, lineStartCoordinate, lineMiddleCoordinate, lineEndCoordinate, isRight }, index) => (
          <React.Fragment key={index}>
            <line
              x1={lineStartCoordinate.x}
              y1={lineStartCoordinate.y}
              x2={lineMiddleCoordinate.x}
              y2={lineMiddleCoordinate.y}
              stroke="white"
              strokeWidth={1}
            />
            <line
              x1={lineMiddleCoordinate.x}
              y1={lineMiddleCoordinate.y}
              x2={lineEndCoordinate.x}
              y2={lineEndCoordinate.y}
              stroke="white"
              strokeWidth={1}
            />
            <text
              x={lineEndCoordinate.x}
              y={lineEndCoordinate.y - textMargin}
              fill="white"
              fontFamily="Segoe UI"
              fontSize={fontSize}
              fontWeight="bold"
              textAnchor={isRight ? 'end' : 'start'}
            >
              {moment(date).format('MMM YYYY')}
            </text>
            <text
              x={lineEndCoordinate.x}
              y={lineEndCoordinate.y + textMargin + fontSize}
              fill="white"
              fontFamily="Segoe UI"
              fontSize={fontSize}
              textAnchor={isRight ? 'end' : 'start'}
            >
              {count} Product
            </text>
            <text
              x={lineEndCoordinate.x}
              y={lineEndCoordinate.y + textMargin + fontSize * 2.3}
              fill="white"
              fontFamily="Segoe UI"
              fontSize={fontSize}
              textAnchor={isRight ? 'end' : 'start'}
            >
              $ {total}
            </text>
          </React.Fragment>
        )
      )}
      {percentData.map(({ alpha, startCoordinate1, endCoordinate1, startCoordinate2, endCoordinate2 }, index) => (
        <path
          key={index}
          d={`M ${startCoordinate1.x} ${startCoordinate1.y} A ${outerRadius} ${outerRadius} 0, ${
            alpha > Math.PI ? 1 : 0
          }, 1, ${endCoordinate1.x} ${endCoordinate1.y} L ${endCoordinate2.x} ${
            endCoordinate2.y
          } A ${innerRadius} ${innerRadius} 0, ${alpha > Math.PI ? 1 : 0}, 0, ${startCoordinate2.x} ${
            startCoordinate2.y
          } L ${startCoordinate1.x} ${startCoordinate1.y} Z`}
          strokeWidth={0}
          stroke="red"
          fill={`url(#grad-${index})`}
        />
      ))}
      <text
        x={coordinate.x}
        y={coordinate.y}
        fill="white"
        textAnchor="middle"
        alignmentBaseline="central"
        fontFamily="Segoe UI"
        fontWeight="bold"
        fontSize={fontSize}
      >
        Shop History
      </text>
    </svg>
  );
};
