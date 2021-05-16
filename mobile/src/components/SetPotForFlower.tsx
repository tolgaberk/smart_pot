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
import { getReduxState } from '../redux/configureStore';
import Text from './Text';

interface SetPotForFlowerModalProps {
  visible: boolean;
  onClose: () => void;
  onSet: () => void;
  flowerId: number;
}

const SetPotForFlowerModal: FC<SetPotForFlowerModalProps> = ({
  onClose,
  onSet,
  visible,
  flowerId,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const close = () => {
    setIsVisible(false);
    onClose();
  };

  const [pots, setPots] = useState<IPot[]>([]);
  useEffect(() => {
    if (isVisible) {
      Api.feathers
        .service('pots')
        .find({ query: { user_id: getReduxState().authState.id } })
        .then((res) => {
          setPots((res as Paginated<IPot>).data);
        });
    }
  }, [isVisible]);

  const onPotPress = (id: number) => async () => {
    console.log(id);
    const potService = Api.feathers.service('pots');
    await potService.patch(id, { current_flower: flowerId });
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
          <Text style={styles.modalTitle}>Saksılarım</Text>
          <ScrollView>
            {pots.map((pot) => (
              <Pressable
                key={pot.id}
                style={pressableStyle(styles.flowerCard)}
                onPress={onPotPress(pot.id)}>
                {pot.images[0] && (
                  <FastImage
                    source={{ uri: Api.url + pot.images[0].path }}
                    style={styles.flowerImage}
                    resizeMode="cover"
                  />
                )}
                <Text numberOfLines={1}>{pot.name}</Text>
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

export default SetPotForFlowerModal;
