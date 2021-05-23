import { useIsFocused, useRoute } from '@react-navigation/core';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { View, SafeAreaView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { MediaStream, RTCView } from 'react-native-webrtc';
import Api from '../Api';
import Button from '../components/Button';
import { Header } from '../components/Header';
import { dimensions } from '../config/dimensions';
import generalStyles from '../config/generalStyles';
import colors from '../config/colors';
import { PotDatas } from '../components/PotDatas';
import { PotInfo } from '../components/PotInfo';
import { Edit3, Plant } from '../assets/icons';
import { pressableStyle } from '../helpers/pressableStyle';
import SetCurrentFlowerModal from '../components/SetCurrentFlowerModal';
import { Text } from '../components';
import ChangeNameOfPotModal from '../components/ChangeNameOfPot';

interface MyPotProps {}

const MyPot: FC<MyPotProps> = () => {
  const route = useRoute();
  const [stream, setStream] = useState<MediaStream>();
  const [pot, setPot] = useState<IPot>();
  const [loading, setLoading] = useState(true);
  const [searchingStream, setSearchingStream] = useState<
    'not_searching' | 'searching' | 'found'
  >('not_searching');

  const id = (route.params as any)?.id;
  const isFocused = useIsFocused();

  const getter = useCallback(async () => {
    if (isFocused) {
      const res = await Api.feathers.service('pots').get(id);
      setPot(res);
      setLoading(false);
    } else {
      setPot(undefined);
      closeRTC();
      setLoading(true);
    }
  }, [id, isFocused]);

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

  const scrollRef = useRef<ScrollView>(null);
  const searchTimeoutRef = useRef<number>(0);

  const initRTC = () => {
    let timeouted = false;
    if (pot) {
      searchTimeoutRef.current = setTimeout(() => {
        setSearchingStream('not_searching');
        Alert.alert(
          'Yayın Bulunamadı!',
          'Saksınızın doğru çalıştığından emin olunuz...',
        );
        timeouted = true;
      }, 5000);

      Api.initRTC((newStream) => {
        if (!timeouted && newStream) {
          setStream((_) => newStream);
          clearTimeout(searchTimeoutRef.current);
          scrollRef.current?.scrollTo({ x: 0 });
          setSearchingStream('found');
        }
      }, pot?.MAC);
      setSearchingStream('searching');
    }
  };

  const closeRTC = () => {
    setSearchingStream('not_searching');
    Api.closeRTC();
    setStream(undefined);
  };

  const btnText =
    searchingStream === 'searching'
      ? 'Yayın Aranıyor...'
      : searchingStream === 'not_searching'
      ? 'Yayın İzlemeyi Başlat'
      : 'Yayını kapat';

  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const [canWater, setCanWater] = useState<boolean>(true);
  const [canToggle, setCanToggle] = useState<boolean>(true);
  const water = () => {
    if (canWater) {
      Api.socket.emit('water', pot?.id, (res: string) => {
        console.log({ res });
      });
      setCanWater(false);
      setTimeout(() => {
        setCanWater(true);
      }, 5000);
    } else {
      Alert.alert(
        'Sulanıyor',
        'Sulama komutunu 5 saniyede bir gönderebilirsiniz.',
      );
    }
  };
  const toggleLights = () => {
    if (canToggle) {
      Api.socket.emit('light_toggle', pot?.id, (res: string) => {
        console.log({ res });
      });
      setCanToggle(false);
      setTimeout(() => {
        setCanToggle(true);
      }, 5000);
    }
  };

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const closeNameModal = () => setNameModalVisible(false);
  return (
    <SafeAreaView style={generalStyles.flex}>
      <Header
        leftIsBack
        title={pot?.name ?? ''}
        Right={() => (
          <View style={styles.btnn}>
            <Pressable
              style={pressableStyle({ padding: 4 })}
              onPress={() => {
                setModalVisible(true);
              }}>
              <Plant color={colors.black} />
            </Pressable>
            <Pressable
              style={pressableStyle({ marginLeft: 16, padding: 4 })}
              onPress={() => {
                setNameModalVisible(true);
              }}>
              <Edit3 color={colors.black} />
            </Pressable>
          </View>
        )}
      />
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
                  style={styles.sliderImage}
                />
              ) : null}
              {pot.images?.map((image, i) => (
                <FastImage
                  key={image.path + i}
                  source={{ uri: Api.url + image.path }}
                  style={styles.sliderImage}
                />
              ))}
            </ScrollView>
            <View style={styles.potInfoCardContainer}>
              <Text style={styles.podIntoTitle}>Saksı Bilgileri</Text>
              <PotInfo pot={pot} />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                disabled={!canWater}
                style={[generalStyles.flex, styles.btn]}
                text="Sula"
                onPress={water}
              />
              <Button
                style={[generalStyles.flex, styles.btn]}
                text="Işık Aç/Kapa"
                disabled={!canToggle}
                onPress={toggleLights}
              />
            </View>
            <View style={styles.potInfoCardContainer}>
              <Text style={styles.podIntoTitle}>Saksı Data Kayıtları</Text>
              <PotDatas pot={pot} />
            </View>
            <SetCurrentFlowerModal
              potId={pot.id}
              visible={modalVisible}
              onClose={closeModal}
              onSet={reload}
            />
            <ChangeNameOfPotModal
              visible={nameModalVisible}
              onChanged={reload}
              onClose={closeNameModal}
              potId={pot.id}
            />
          </>
        )}
      </ScrollView>
      <Button
        style={styles.rtcSearchButton}
        disabled={searchingStream === 'searching'}
        text={btnText}
        onPress={searchingStream === 'not_searching' ? initRTC : closeRTC}
      />
    </SafeAreaView>
  );
};

export default MyPot;

export const styles = StyleSheet.create({
  btnn: { flexDirection: 'row' },
  btn: { marginHorizontal: 24 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-evenly' },
  sliderImage: {
    height: dimensions.height / 3,
    width: dimensions.width,
  },
  rtcSearchButton: { marginHorizontal: 64, marginVertical: 16 },
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
});
