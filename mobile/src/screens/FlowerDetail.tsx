import { useRoute } from '@react-navigation/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Api from '../Api';
import colors from '../config/colors';
import { dimensions } from '../config/dimensions';
import { Header } from '../components/Header';
interface FlowerDetailProps {}

const FlowerDetail: FC<FlowerDetailProps> = () => {
  const [flower, setFlower] = useState<IFlower>();
  const route = useRoute();
  const getter = useCallback(async () => {
    const res = await Api.feathers
      .service('flowers')
      .get((route.params as any)?.id);
    setFlower(res);
  }, [route.params]);

  useEffect(() => {
    getter();
  }, [getter]);
  return flower ? (
    <SafeAreaView>
      <Header title={flower.name} leftIsBack />
      <ScrollView>
        <ScrollView
          horizontal
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
  textContainer: { paddingHorizontal: 16 },
  sectionHeader: { fontSize: 24, color: colors.primary, paddingBottom: 8 },
  sectionContainer: { alignItems: 'center', paddingTop: 16 },
});
