import React from 'react';
import { View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import colors from '../config/colors';
import { Text } from '.';

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
const clampPercent = (num: number) => Math.min(Math.max(num, 0), 100);
const addPercentSign = (val: string | number) => val + ' %';
const addCelcius = (val: string | number) => val + ' °C';

function formatVal(
  key: keyof typeof potDataShownKeyMap,
  val: string | number,
): string | number {
  if (['createdAt', 'last_time_watered'].includes(key)) {
    return dayjs(val).fromNow();
  }
  if (['is_lights_open'].includes(key)) {
    return val ? 'Açık' : 'Kapalı';
  }
  if (['close_light_density', 'environment_light_density'].includes(key)) {
    return addPercentSign(clampPercent(((val as number) /= 10)));
  }

  if (['soil_moisture'].includes(key)) {
    return addPercentSign(clampPercent(((val as number) / 400) * 100));
  }

  if (['tank_filled_ratio'].includes(key)) {
    (val as number) /= 900;
    return addPercentSign(clampPercent((val as number) * 100).toFixed(1));
  }
  if (['environment_humidity'].includes(key)) {
    return addPercentSign(val);
  }
  if (['environment_temp'].includes(key)) {
    return addCelcius(val);
  }

  return val;
}
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
                    <Text>{formatVal(key, value)}</Text>
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
