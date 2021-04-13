import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function SvgBack(props: SvgProps) {
  return (
    <Svg height={24} width={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.265 12.714l8.168 8.99a.861.861 0 001.298 0 1.081 1.081 0 000-1.426l-7.52-8.277 7.52-8.278a1.082 1.082 0 000-1.428.861.861 0 00-1.299 0l-8.167 8.991a1.094 1.094 0 000 1.428z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgBack;
