import React, { FC, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Api from '../Api';
import colors from '../config/colors';
import generalStyles from '../config/generalStyles';
import { getReduxState } from '../redux/configureStore';
import Button from './Button';
import Field from './Field';

interface ChangeNameOfPotModalProps {
  visible: boolean;
  onClose: () => void;
  onChanged: () => void;
  potId: number;
}

const ChangeNameOfPotModal: FC<ChangeNameOfPotModalProps> = ({
  visible,
  onClose,
  onChanged,
  potId,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const text = useRef('');
  const alterPot = async () => {
    try {
      const service = Api.feathers.service('pots');

      const id = getReduxState().authState.id;
      if (id) {
        await service.patch(
          potId,
          { name: text.current },
          { query: { user_id: id } },
        );
        onChanged();
        onClose();
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Bir şeyler ters gitti.',
        'Lütfen daha sonra tekrar deneyiniz',
      );
    }
  };
  const close = () => {
    setIsVisible(false);
    onClose();
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={close}
      onDismiss={close}
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      onBackdropPress={close}>
      <View style={generalStyles.centerView}>
        <View style={styles.card}>
          <Text style={styles.text}>Saksı Adı Değiştir</Text>
          <View style={styles.form}>
            <Field
              placeholder="Saksı Adı"
              onChangeText={(txt) => {
                text.current = txt;
              }}
            />
            <Button
              text="Kaydet"
              onPress={() => {
                alterPot();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    minHeight: 190,

    width: '80%',
    borderRadius: 20,
  },
  text: { fontSize: 24, fontWeight: 'bold', paddingLeft: 20, marginTop: 4 },
  form: {
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
    flex: 1,
    flexGrow: 1,
  },
});
export default ChangeNameOfPotModal;
