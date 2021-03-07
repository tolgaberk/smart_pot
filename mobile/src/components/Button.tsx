import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';

interface ButtonProps {
  text: string;
}

const Button: FC<ButtonProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.primary },
});
export default Button;
