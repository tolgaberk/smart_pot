import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgMembership(props: SvgProps) {
  return (
    <Svg width={32} height={20} fill="none" {...props}>
      <Path
        d="M27 6.5H16m11 3H16m11 3H16M8.5 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0 0a4 4 0 00-4 4h8a4 4 0 00-4-4zM1 1h30v18H1V1z"
        stroke={props.color}
        strokeLinecap="square"
      />
    </Svg>
  );
}

export default SvgMembership;
