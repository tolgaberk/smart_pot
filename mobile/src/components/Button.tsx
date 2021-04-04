import React, { FC } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import colors from '../config/colors';

interface ButtonProps {
  text: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const Button: FC<ButtonProps> = ({ text, onPress, style }) => {
  return (
    <Pressable
      style={pressableStyle([styles.container, style])}
      onPress={onPress}>
      <Text>{text}</Text>
    </Pressable>
  );
};
const pressableStyle = (style: StyleProp<ViewStyle>) => ({
  pressed,
}: {
  pressed: boolean;
}): StyleProp<ViewStyle> => [
  {
    opacity: pressed ? 0.8 : 1,
  },
  style,
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
export default Button;
