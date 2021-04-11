import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgSearch(props: SvgProps) {
  return (
    <Svg width={31} height={30} fill="none" {...props}>
      <Path
        d="M12.337 17.97A8 8 0 1023.651 6.658 8 8 0 0012.337 17.97zm0 0L6.68 23.628"
        stroke="#000"
        strokeLinecap="square"
      />
    </Svg>
  );
}

export default SvgSearch;
