import { ViewStyle, StyleProp } from 'react-native';

export const pressableStyle = (style?: StyleProp<ViewStyle>) => ({
  pressed,
}: {
  pressed: boolean;
}): StyleProp<ViewStyle> => [
  {
    opacity: pressed ? 0.8 : 1,
  },
  style,
];
