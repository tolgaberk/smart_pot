import { useNavigation } from '@react-navigation/native';
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
import { PlusSquare } from '../assets/icons';
import { Text } from '../components';
import { Header } from '../components/Header';
import RegisterPotModal from '../components/RegisterPotModal';
import colors from '../config/colors';
import generalStyles from '../config/generalStyles';
import { pressableStyle } from '../helpers/pressableStyle';
import { getReduxState } from '../redux/configureStore';

interface MyPotsProps {}

const MyPots: FC<MyPotsProps> = () => {
  const [pots, setPots] = useState<IPot[]>([]);
  const [loading, setLoading] = useState(true);
  const getter = () =>
    Api.feathers
      .service('pots')
      .find({ query: { user_id: getReduxState().authState.id } })
      .then((res: any) => {
        setPots(res.data);
        setLoading(false);
      });
  useEffect(() => {
    getter();
  }, []);
  const reload = () => {
    setLoading(true);
    getter();
  };

  const onRegisterPot = () => {
    setModalVisible((_) => !_);
  };
  const onClose = () => setModalVisible(false);

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={generalStyles.flex}>
      <Header
        title="Saksılarım"
        Right={() => (
          <Pressable
            style={pressableStyle({ paddingLeft: 24 })}
            onPress={onRegisterPot}>
            <PlusSquare color={colors.black} />
          </Pressable>
        )}
      />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={reload} />
        }
        data={pots}
        style={generalStyles.flex}
        contentContainerStyle={generalStyles.flex}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.columWrapper}
        renderItem={({ item }) => <PotCard pot={item} />}
      />
      <RegisterPotModal
        visible={modalVisible}
        onClose={onClose}
        onRegistered={reload}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  columWrapper: {
    justifyContent: 'space-evenly',
    marginVertical: 8,
  },
  image: { height: 150, width: 150, borderRadius: 8, elevation: 5 },
  itemTitle: {
    fontSize: 20,
    marginTop: 8,
    color: colors.primary,
  },
});
export default MyPots;

interface PotCardProps {
  pot: IPot;
}

const PotCard: FC<PotCardProps> = ({ pot }) => {
  const uri = Api.url + pot.images[0]?.path;
  const navigation = useNavigation();
  const onPress = (id: number) => () => {
    navigation.navigate('MyPot', { id });
  };
  return (
    <Pressable
      onPress={onPress(pot.id)}
      style={pressableStyle({
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 4,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: colors.card,
        elevation: 2,
      })}>
      <FastImage source={{ uri }} style={styles.image} />
      <Text text={pot.name} style={styles.itemTitle} />
    </Pressable>
  );
};
