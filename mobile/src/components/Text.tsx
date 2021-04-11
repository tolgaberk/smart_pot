import React, { FC } from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  text?: string;
}

const Text: FC<CustomTextProps> = (props) => {
  const { style } = props;

  return (
    <RNText {...props} style={[{ fontFamily: 'Montserrat-Regular' }, style]}>
      {props.text ?? ''}
    </RNText>
  );
};

export default Text;
