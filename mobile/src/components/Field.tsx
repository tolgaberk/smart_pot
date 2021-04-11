import React, { FC } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import colors from '../config/colors';

interface FieldProps extends TextInputProps {}

const Field: FC<FieldProps> = (props) => {
  return <TextInput {...props} style={[styles.default, props.style]} />;
};

const styles = StyleSheet.create({
  default: {
    minHeight: 16,
    paddingHorizontal: 8,
    paddingVertical: 14,
    // borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 4,
  },
});

export default Field;
