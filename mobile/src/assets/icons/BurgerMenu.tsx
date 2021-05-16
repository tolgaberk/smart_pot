import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgBurgerMenu(props: SvgProps) {
  return (
    <Svg width={18} height={13} fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 12.5h18v-2H0v2zm0-5h18v-2H0v2zm0-7v2h18v-2H0z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgBurgerMenu;
