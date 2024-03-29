import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgFeather(props: SvgProps) {
  return (
    <Svg
      width={24}
      height={24}
      fill="none"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <Path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5zM16 8L2 22M17.5 15H9" />
    </Svg>
  );
}

export default SvgFeather;
