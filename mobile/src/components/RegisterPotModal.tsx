import React, { FC, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Api from '../Api';
import colors from '../config/colors';
import generalStyles from '../config/generalStyles';
import { getReduxState } from '../redux/configureStore';
import Button from './Button';
import Field from './Field';

interface RegisterPotModalProps {
  visible: boolean;
  onClose: () => void;
  onRegistered: () => void;
}

const RegisterPotModal: FC<RegisterPotModalProps> = ({
  visible,
  onClose,
  onRegistered,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const text = useRef('');
  const findPot = async () => {
    try {
      const service = Api.feathers.service('pots');

      const id = getReduxState().authState.id;
      if (id) {
        const res = await service.patch(
          null,
          { user_id: id },
          { query: { MAC: text.current } },
        );
        if (res.length > 0) {
          onRegistered();
          onClose();
        } else {
          Alert.alert(
            'Saksı bulunamadı.',
            'Lütfen doğru kodu girdiğinizden emin olun.',
          );
        }
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
          <Text style={styles.text}>Saksı Ekle</Text>
          <View style={styles.form}>
            <Field
              placeholder="Saksı kodu"
              onChangeText={(txt) => {
                text.current = txt;
              }}
            />
            <Button
              text="Kaydet"
              onPress={() => {
                findPot();
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
export default RegisterPotModal;
