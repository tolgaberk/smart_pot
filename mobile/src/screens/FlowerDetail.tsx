import { useRoute } from '@react-navigation/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Api from '../Api';
import colors from '../config/colors';
import { dimensions } from '../config/dimensions';
import { Header } from '../components/Header';
import generalStyles from '../config/generalStyles';
import SetPotForFlowerModal from '../components/SetPotForFlower';
import { Plant } from '../assets/icons';
import { pressableStyle } from '../helpers/pressableStyle';
interface FlowerDetailProps {}

const FlowerDetail: FC<FlowerDetailProps> = () => {
  const [flower, setFlower] = useState<IFlower>();
  const route = useRoute();
  const flowerId = (route.params as any)?.id;
  const getter = useCallback(async () => {
    const res = await Api.feathers.service('flowers').get(flowerId);
    setFlower(res);
  }, [flowerId]);

  useEffect(() => {
    getter();
  }, [getter]);

  const onSet = () => {
    Alert.alert(
      'Başarılı',
      `Seçilen saksıya ${flower?.name ? flower?.name : ''} başarıyla atandı.`,
    );
  };
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  return flower ? (
    <SafeAreaView style={generalStyles.flex}>
      <Header
        title={flower.name ?? ''}
        leftIsBack
        Right={() => (
          <Pressable
            style={pressableStyle()}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Plant color={colors.black} />
          </Pressable>
        )}
      />
      <SetPotForFlowerModal
        visible={modalVisible}
        onClose={closeModal}
        flowerId={flowerId}
        onSet={onSet}
      />
      <ScrollView>
        <ScrollView
          horizontal
          style={styles.scrollView}
          snapToInterval={dimensions.width}
          showsHorizontalScrollIndicator={false}>
          {flower.images.map((image, i) => (
            <FastImage
              key={image.path + i}
              source={{ uri: Api.url + image.path }}
              style={{ height: dimensions.height / 3, width: dimensions.width }}
            />
          ))}
        </ScrollView>
        <View style={styles.textContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Aile</Text>
            <Text>{flower.family}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Kaynak</Text>
            <Text>{flower.source}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Yetiştirme</Text>
            <Text>{flower.description}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  ) : null;
};

export default FlowerDetail;

export const styles = StyleSheet.create({
  scrollView: { flex: 1, flexGrow: 1 },
  textContainer: { paddingHorizontal: 16 },
  sectionHeader: { fontSize: 24, color: colors.primary, paddingBottom: 8 },
  sectionContainer: { alignItems: 'center', paddingTop: 16 },
});
