import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import colors from '../config/colors';

export function Loader() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
