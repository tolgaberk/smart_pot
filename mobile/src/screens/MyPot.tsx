import { useRoute } from '@react-navigation/core';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { View, Text, SafeAreaView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { MediaStream, RTCView } from 'react-native-webrtc';
import Api from '../Api';
import Button from '../components/Button';
import { Header } from '../components/Header';
import { dimensions } from '../config/dimensions';
import generalStyles from '../config/generalStyles';
import dayjs from 'dayjs';
import colors from '../config/colors';

interface MyPotProps {}

const MyPot: FC<MyPotProps> = () => {
  const route = useRoute();
  const id = (route.params as any)?.id;
  const [stream, setStream] = useState<MediaStream>();
  const [pot, setPot] = useState<IPot>();
  const [loading, setLoading] = useState(true);
  const [searchingStream, setSearchingStream] = useState<
    'not_searching' | 'searching' | 'found'
  >('not_searching');
  const getter = useCallback(() => {
    Api.feathers
      .service('pots')
      .get(id)
      .then((res: IPot) => {
        setPot(res);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const service = Api.feathers.service('pot_data');
    service.on('created', getter);
    return () => {
      service.removeListener('created', getter);
    };
  }, [getter]);

  useEffect(() => {
    getter();
  }, [getter]);

  const reload = () => {
    setLoading(true);
    getter();
  };
  const potInfoKeyNameMap = {
    MAC: 'MAC',
    createdAt: 'Oluşturulma Tarihi',
    id: 'Saksı No',
    ip: 'IP Adresi',
    name: 'Saksı Adı',
  };
  const potDataShownKeyMap = {
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
  const scrollRef = useRef<ScrollView>(null);
  const initRTC = () => {
    Api.initRTC((newStream) => {
      setStream((_) => newStream);
      scrollRef.current?.scrollTo({ x: 0 });
      setSearchingStream('found');
    });
    setSearchingStream('searching');
  };
  const closeRTC = () => {
    setSearchingStream('not_searching');
    Api.closeRTC();
    setStream(undefined);
    Api.socket.emit('disconnect');
  };
  return (
    <SafeAreaView style={generalStyles.flex}>
      <Header leftIsBack title={pot?.name ?? ''} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={reload} />
        }>
        {pot && (
          <>
            <ScrollView
              ref={scrollRef}
              horizontal
              snapToInterval={dimensions.width}
              style={generalStyles.flex}>
              {stream ? (
                <RTCView
                  streamURL={stream.toURL()}
                  objectFit="contain"
                  style={{
                    height: dimensions.height / 3,
                    width: dimensions.width,
                  }}
                />
              ) : null}
              {pot.images.map((image, i) => (
                <FastImage
                  key={image.path + i}
                  source={{ uri: Api.url + image.path }}
                  style={{
                    height: dimensions.height / 3,
                    width: dimensions.width,
                  }}
                />
              ))}
            </ScrollView>
            <View style={styles.potInfoCardContainer}>
              <Text style={styles.podIntoTitle}>Saksı Bilgileri</Text>
              {(Object.entries(pot) as [any, any][]).map((item) => {
                const [key, value]: [
                  keyof typeof potInfoKeyNameMap,
                  string,
                ] = item;
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
                          : value}
                      </Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
            <View style={styles.potInfoCardContainer}>
              <Text style={styles.podIntoTitle}>Saksı Data Kayıtları</Text>
              {pot.data?.map((data, i) => {
                return (
                  <View key={data.id + i} style={styles.potInfoCardContainer}>
                    {(Object.entries(data) as [any, any][]).map((item, idx) => {
                      const [key, value]: [
                        keyof typeof potDataShownKeyMap,
                        string,
                      ] = item;
                      if (Object.keys(potDataShownKeyMap).includes(key)) {
                        return (
                          <View
                            key={value + key + idx}
                            style={[
                              styles.coupleTextRow,
                              { marginVertical: 0 },
                            ]}>
                            <Text style={styles.coupleTextTitle}>
                              {potDataShownKeyMap[key]}
                            </Text>
                            <Text>
                              {key === 'createdAt' ||
                              key === 'last_time_watered'
                                ? dayjs(value).toNow()
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
            </View>
          </>
        )}
      </ScrollView>
      <Button
        style={{ marginHorizontal: 64, marginVertical: 16 }}
        disabled={searchingStream === 'searching'}
        text={
          searchingStream === 'searching'
            ? 'Yayın Aranıyor...'
            : searchingStream === 'not_searching'
            ? 'Yayın İzlemeyi Başlat'
            : 'Yayını kapat'
        }
        onPress={searchingStream === 'not_searching' ? initRTC : closeRTC}
      />
    </SafeAreaView>
  );
};

export default MyPot;

const styles = StyleSheet.create({
  coupleTextTitle: { fontWeight: '700' },
  podIntoTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.primary,
    fontSize: 24,
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
  coupleTextRow: {
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
