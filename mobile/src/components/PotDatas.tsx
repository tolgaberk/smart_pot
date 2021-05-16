import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import colors from '../config/colors';

export const potDataShownKeyMap = {
  id: 'Kayıt No',
  environment_temp: 'Çevre Sıcaklığı',
  environment_humidity: 'Çevre Nem Oranı',
  soil_moisture: 'Toprak Nem Oranı',
  tank_filled_ratio: 'Su tankı doluluk oranı',
  environment_light_density: 'Çevresel ışık yoğunluğu',
  close_light_density: 'Yakın ışık yoğunluğu',
  last_time_watered: 'Son sulama tarihi',
  is_lights_open: 'Işık durumu',
  createdAt: 'Kayıt tarihi',
};

export function PotDatas({ pot }: { pot: IPot }) {
  return (
    <>
      {pot.data?.map((data, i) => {
        const containerKey = data.id + '-' + i.toString();
        return (
          <View key={containerKey} style={styles.potInfoCardContainer}>
            {(Object.entries(data) as [any, any][]).map((item, idx) => {
              const [key, value]: [
                keyof typeof potDataShownKeyMap,
                string,
              ] = item;
              if (Object.keys(potDataShownKeyMap).includes(key)) {
                return (
                  <View
                    key={value + key + idx + containerKey}
                    style={[styles.coupleTextRowNoMargin]}>
                    <Text style={styles.coupleTextTitle}>
                      {potDataShownKeyMap[key]}
                    </Text>
                    <Text>
                      {key === 'createdAt' || key === 'last_time_watered'
                        ? dayjs(value).fromNow()
                        : key === 'is_lights_open'
                        ? value
                          ? 'Açık'
                          : 'Kapalı'
                        : value}
                    </Text>
                  </View>
                );
              }
            })}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  coupleTextTitle: { fontWeight: '700' },

  coupleTextRowNoMargin: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  potInfoCardContainer: {
    elevation: 4,
    backgroundColor: colors.background,
    margin: 8,
    flex: 1,
    marginTop: 16,
    paddingTop: 4,
    borderRadius: 4,
  },
});
