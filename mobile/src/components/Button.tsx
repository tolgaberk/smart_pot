import React, { FC } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import colors from '../config/colors';
import { pressableStyle } from '../helpers/pressableStyle';

interface ButtonProps {
  text: string;
  textColor?: string;
  textSize?: number;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  text,
  onPress,
  style,
  textSize = 16,
  textColor = colors.whiteText,
  disabled = false,
}) => {
  const localStyle = [styles.container, style];
  if (disabled) {
    localStyle.push({ backgroundColor: 'gray' });
  }
  return (
    <Pressable
      disabled={disabled}
      style={pressableStyle(localStyle)}
      onPress={onPress}>
      <Text style={{ color: textColor, fontSize: textSize }}>{text}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
});
export default Button;
