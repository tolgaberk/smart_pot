import { useNavigation } from '@react-navigation/core';
import React, { FC, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Api from '../Api';
import { Text } from '../components';
import colors from '../config/colors';
import generalStyles from '../config/generalStyles';
import { pressableStyle } from '../helpers/pressableStyle';
import { Header } from '../components/Header';
interface FlowersListProps {}

const FlowersList: FC<FlowersListProps> = () => {
  const [flowers, setFlowers] = useState<{ data: IFlower[] }>({ data: [] });
  const [loading, setLoading] = useState(true);
  const getter = async () => {
    const res = await Api.feathers.service('flowers').find();
    setFlowers(res);
    setLoading(false);
  };
  useEffect(() => {
    getter();
  }, []);
  const reload = () => {
    setLoading(true);
    getter();
  };

  return (
    <SafeAreaView style={generalStyles.flex}>
      <Header title="Çiçek ve Bitkiler" />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={reload} />
        }
        data={flowers.data}
        style={generalStyles.flex}
        contentContainerStyle={generalStyles.flex}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.columWrapper}
        renderItem={({ item }) => <FlowerCard flower={item} />}
      />
    </SafeAreaView>
  );
};

export default FlowersList;

const styles = StyleSheet.create({
  columWrapper: {
    justifyContent: 'space-evenly',
    marginVertical: 8,
  },
  image: { height: 150, width: 150 },
  itemTitle: {
    fontWeight: '400',
    fontSize: 20,
    marginTop: 8,
    color: colors.primary,
  },
});

interface FlowerCardProps {
  flower: IFlower;
}

const FlowerCard: FC<FlowerCardProps> = ({ flower }) => {
  const uri = Api.url + flower.images[0]?.path;
  const navigation = useNavigation();
  const onPress = (id: number) => () => {
    navigation.navigate('FlowerDetail', { id: id });
  };
  return (
    <Pressable
      onPress={onPress(flower.id)}
      style={pressableStyle({
        paddingHorizontal: 4,
        paddingTop: 8,
        paddingBottom: 4,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: colors.card,
      })}>
      <FastImage source={{ uri }} style={styles.image} />
      <Text text={flower.name} style={styles.itemTitle} />
    </Pressable>
  );
};
