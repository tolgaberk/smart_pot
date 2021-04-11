import { useNavigation, useRoute } from '@react-navigation/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Api from '../Api';
import { BurgerMenu } from '../assets/icons';
import colors from '../config/colors';
import { dimensions } from '../config/dimensions';
import { pressableStyle } from '../helpers/pressableStyle';
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
      <Header flower={flower} />
      <ScrollView>
        <ScrollView
          horizontal
          snapToInterval={dimensions.width}
          showsHorizontalScrollIndicator={false}>
          {flower.images.map((image) => (
            <FastImage
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

const Header: FC<{ flower: IFlower }> = ({ flower }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <Pressable
        style={pressableStyle(styles.spacer)}
        onPress={() => navigation.goBack()}>
        <View style={styles.leftContainer}>
          <BurgerMenu color={colors.black} />
        </View>
      </Pressable>
      <Text style={styles.headerTitle}>{flower.name}</Text>
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: { paddingHorizontal: 16 },
  sectionHeader: { fontSize: 24, color: colors.primary, paddingBottom: 8 },
  sectionContainer: { alignItems: 'center', paddingTop: 16 },
  spacer: { flexGrow: 1, flex: 1 },
  leftContainer: { padding: 16 },
  headerTitle: {
    color: colors.primary,
    fontSize: 32,
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: -80,
    paddingTop: 80,
    alignItems: 'center',
    height: 140,
  },
});
