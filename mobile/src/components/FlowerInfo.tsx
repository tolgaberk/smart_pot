import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '.';

export const flowerInfoKeyNameMap = {
  max_moisture: 'Nem Üst Limit',
  min_moisture: 'Nem Alt Limit',
  min_light_exposure: 'Günlük ışık ihtiyacı',
  max_temp: 'Sıcaklık Üst Limit',
  min_temp: 'Sıcaklık Alt Limit',
};

function formatVal(
  key: keyof typeof flowerInfoKeyNameMap,
  val: string | number,
): string | number {
  if (['max_moisture', 'min_moisture'].includes(key)) {
    val += '%';
  }
  if (['min_temp', 'max_temp'].includes(key)) {
    val += '°C';
  }
  if (['min_light_exposure'].includes(key)) {
    val += ' Saat';
  }

  return val;
}
export function FlowerInfo({
  flower,
}: {
  flower: IFlowerReference | undefined;
}) {
  if (flower) {
    return (
      <>
        {(Object.entries(flower) as [any, any][]).map((item) => {
          const [key, value]: [
            keyof typeof flowerInfoKeyNameMap,
            string,
          ] = item;
          const shownKeys = Object.keys(flowerInfoKeyNameMap);
          if (shownKeys.includes(key)) {
            return (
              <View key={value + key} style={styles.coupleTextRow}>
                <Text style={styles.coupleTextTitle}>
                  {flowerInfoKeyNameMap[key]}
                </Text>
                <Text>{formatVal(key, value)}</Text>
              </View>
            );
          }
          return null;
        })}
      </>
    );
  } else {
    return (
      <View>
        <Text>Aktif Çiçek Bulunamadı</Text>
      </View>
    );
  }
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
