import React from 'react';
import { View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { Text } from '.';

export const potInfoKeyNameMap = {
  MAC: 'MAC Adresi',
  createdAt: 'Oluşturulma Tarihi',
  id: 'Saksı No',
  ip: 'IP Adresi',
  name: 'Saksı Adı',
  flower: 'Aktif çiçek',
};
export function PotInfo({ pot }: { pot: IPot }) {
  return (
    <>
      {(Object.entries(pot) as [any, any][]).map((item) => {
        const [key, value]: [keyof typeof potInfoKeyNameMap, string] = item;
        const shownKeys = Object.keys(potInfoKeyNameMap);
        if (shownKeys.includes(key)) {
          return (
            <View key={value + key} style={styles.coupleTextRow}>
              <Text style={styles.coupleTextTitle}>
                {potInfoKeyNameMap[key]}
              </Text>
              <Text>
                {key === 'createdAt'
                  ? dayjs(value).format('DD MMMM YYYY')
                  : key === 'flower'
                  ? ((value as unknown) as IFlower).name
                  : value}
              </Text>
            </View>
          );
        }
        return null;
      })}
    </>
  );
}

const styles = StyleSheet.create({
  coupleTextTitle: { fontWeight: '700' },
  coupleTextRow: {
    marginVertical: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
