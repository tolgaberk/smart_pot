import { useNavigation } from '@react-navigation/core';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Api from '../Api';
import { Text } from '../components';
import colors from '../config/colors';
import generalStyles from '../config/generalStyles';
import { pressableStyle } from '../helpers/pressableStyle';
interface FlowersListProps {}

const FlowersList: FC<FlowersListProps> = () => {
  const [flowers, setFlowers] = useState<{ data: any[] }>({ data: [] });
  const getter = async () => {
    const res = await Api.feathers.service('flowers').find();
    setFlowers(res);
  };
  useEffect(() => {
    getter();
  }, []);
  const navigation = useNavigation();
  const onPress = (id: number) => () => {
    navigation.navigate('FlowerDetail', { id: id });
  };
  return (
    <SafeAreaView style={generalStyles.flex}>
      <FlatList
        data={flowers.data}
        style={generalStyles.flex}
        contentContainerStyle={generalStyles.flex}
        numColumns={2}
        columnWrapperStyle={styles.columWrapper}
        renderItem={({ item }) => {
          const uri = Api.url + item.images[0]?.path;
          return (
            <Pressable
              onPress={onPress(item.id)}
              style={pressableStyle({
                padding: 4,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: colors.card,
              })}>
              <FastImage source={{ uri }} style={styles.image} />
              <Text text={item.name} style={styles.itemTitle} />
            </Pressable>
          );
        }}
      />
      {/* <Button
        text="create"
        onPress={async () => {
          await Api.feathers.service('flowers').create({
            name: 'Guzmania',
            family:
              'Angiospermae - Aile Bromeliaceae, alt familya Tillandsioideae',
            // eslint-disable-next-line quotes
            source: "Tropikal Amerika'da meydana gelen, Brezilya kökenli.",
            description:
              '- Doğrudan güneş ışığı istemeyen bu bitki diğer ışık kaynaklarından da yararlanabilir. - Çok fazla soğuk ve sıcak havada bırakma çiçeğin yapraklarına ve köklerine zararlıdır. - Hava akımlarından kolay etkilenen guzmanya bitkisini bu etkiden korunmalıdır. - Her bitki gibi zamanla topraktaki vitamin ve mineralleri tüketen bitkiye yılda en az bir kere vitamin ve mineral desteği sağlanmalıdır. - Saksı değişimi genellikle 2-3 yılda bir sıcak ayların başlangıcı olan mayısta yapılmalıdır. - Guzmanya bulunduğu yerde başka cisimlerle temasta bulunmalıdır',
          });
        }}
      />
      <Button text="get" onPress={getter} /> */}
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
