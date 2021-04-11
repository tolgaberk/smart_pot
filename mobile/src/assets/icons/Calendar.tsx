import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgCalendar(props: SvgProps) {
  return (
    <Svg width={26} height={28} fill="none" {...props}>
      <Path
        d="M25.186 8V3h-5.5m5.5 5h-5.5m5.5 0v4.5m-24-4.5V3h6m-6 5h6m-6 0v4.5m12.5-4.5h6m-6 0h-6.5m6.5 0v4.5m0 14.5h6m-6 0h-6.5m6.5 0v-5m6-14v4.5m0 14.5h3.5a2 2 0 002-2v-3m-5.5 5v-5M7.186 8v4.5m0 14.5h-4a2 2 0 01-2-2v-3m6 5v-5m18-4.5v-5m0 5V22m0-4.5h-5.5m-18.5 0v-5m0 5V22m0-4.5h6m-6-5h6m18 0h-5.5m5.5 9.5h-5.5m-18.5 0h6m12.5-17V3m0 0V1m0 2h-12.5m0 0V1m0 2v2m12.5 7.5v5m0-5h-6m6 5V22m0-4.5h-6m6 4.5h-6m0 0v-4.5m0 4.5h-6.5m6.5-4.5v-5m0 5h-6.5m6.5-5h-6.5m0 0v5m0 0V22"
        stroke={props.color}
        strokeLinecap="square"
      />
    </Svg>
  );
}

export default SvgCalendar;
