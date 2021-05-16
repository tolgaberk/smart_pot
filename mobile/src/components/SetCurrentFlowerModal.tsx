import { Paginated } from '@feathersjs/feathers';
import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import Api from '../Api';
import colors from '../config/colors';
import { dimensions } from '../config/dimensions';
import generalStyles from '../config/generalStyles';
import { pressableStyle } from '../helpers/pressableStyle';
import Text from './Text';

interface SetCurrentFlowerModalProps {
  visible: boolean;
  onClose: () => void;
  onSet: () => void;
  potId: number;
}

const SetCurrentFlowerModal: FC<SetCurrentFlowerModalProps> = ({
  onClose,
  onSet,
  visible,
  potId,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const close = () => {
    setIsVisible(false);
    onClose();
  };

  const [flowers, setFlowers] = useState<IFlower[]>([]);
  useEffect(() => {
    if (isVisible) {
      Api.feathers
        .service('flowers')
        .find()
        .then((res) => {
          setFlowers((res as Paginated<IFlower>).data);
        });
    }
  }, [isVisible]);

  const onFlowerPress = (id: number) => async () => {
    console.log(id);
    const potService = Api.feathers.service('pots');
    await potService.patch(potId, { current_flower: id });
    onSet();
    close();
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={close}
      onDismiss={close}
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      onBackdropPress={close}>
      <View
        style={[
          generalStyles.centerView,
          { maxHeight: (dimensions.height * 3) / 4 },
        ]}>
        <View style={styles.card}>
          <Text style={styles.modalTitle}>Çiçekler</Text>
          <ScrollView>
            {flowers.map((flower) => (
              <Pressable
                key={flower.id}
                style={pressableStyle(styles.flowerCard)}
                onPress={onFlowerPress(flower.id)}>
                {flower.images[0] && (
                  <FastImage
                    source={{ uri: Api.url + flower.images[0].path }}
                    style={styles.flowerImage}
                    resizeMode="cover"
                  />
                )}
                <Text numberOfLines={1}>{flower.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalTitle: { fontSize: 24, textAlign: 'center', marginVertical: 8 },
  flowerImage: {
    height: 36,
    width: 48,
    borderRadius: 5,
    marginRight: 16,
  },
  flowerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
    margin: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.card,
  },
  card: {
    backgroundColor: colors.background,
    minHeight: 190,
    width: '80%',
    borderRadius: 20,
  },
});

export default SetCurrentFlowerModal;
