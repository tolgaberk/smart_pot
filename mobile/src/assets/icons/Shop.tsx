import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgShop(props: SvgProps) {
  return (
    <Svg width={25} height={31} fill="none" {...props}>
      <Path
        d="M12.314 8c.684 0-.315 0 0 0zM12.314 8c-.684 0 .316 0 0 0z"
        fill="#000"
      />
      <Path
        d="M.814 19v11h11.5M.814 19V8h11.5M.814 19h11.5m11.5 0V8h-11.5m11.5 11v11h-11.5m11.5-11h-11.5m0-11c1-4.5 4.245-8.5 6.686-6 2.472 2.532-3.81 5.844-6.686 6zm0 0c-.315 0 .684 0 0 0zm0 0v11m0-11c-1-4.5-4.245-8.5-6.686-6-2.472 2.532 3.81 5.844 6.686 6zm0 0c.316 0-.684 0 0 0zm0 22V19"
        stroke="#000"
        strokeLinecap="square"
      />
    </Svg>
  );
}

export default SvgShop;
