import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgEdit3(props: SvgProps) {
  return (
    <Svg
      width={24}
      height={24}
      fill="none"
      stroke={props.color}
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <Path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </Svg>
  );
}

export default SvgEdit3;
