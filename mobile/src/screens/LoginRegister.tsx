import { useNavigation } from '@react-navigation/core';
import { Formik } from 'formik';
import React, { FC } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import BackgroundImage from '../assets/background.png';
import { Button, Text } from '../components';
import Field from '../components/Field';
import colors from '../config/colors';
import generalStyles from '../config/generalStyles';
import { loginAction } from '../redux/auth/authActions';
import { asyncDispatch } from '../redux/configureStore';
interface LoginRegisterProps {}

const LoginRegister: FC<LoginRegisterProps> = () => {
  const navigation = useNavigation();

  const login = async (params: typeof initialValues) => {
    try {
      await asyncDispatch(loginAction(params));
      navigation.navigate('App');
    } catch (error) {}
  };
  const goWithoutLogin = () => {
    navigation.navigate('App');
  };
  const initialValues = {
    email: 'test@test.com',
    password: 'testTest',
    from: 'login',
  } as const;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={generalStyles.flex}
        contentContainerStyle={generalStyles.flex}
        bounces={false}>
        <View style={styles.upper}>
          <Text style={styles.title}>AKILLI SAKSI</Text>
        </View>
        <View style={styles.down}>
          <Formik initialValues={initialValues} onSubmit={login}>
            {({ handleSubmit, handleChange, handleBlur }) => (
              <>
                <Field
                  placeholder="Email"
                  style={styles.inputStyle}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                <Field
                  placeholder="Şifre"
                  style={styles.inputStyle}
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <View style={styles.buttons}>
                  <Button
                    style={styles.button}
                    text="Giriş yap"
                    textSize={24}
                    onPress={() => {
                      handleChange('from')('login');
                      handleSubmit();
                    }}
                  />
                  <Button
                    style={styles.button}
                    text="Üye Ol"
                    textSize={24}
                    onPress={() => {
                      handleChange('from')('register');
                      handleSubmit();
                    }}
                  />
                  <Button
                    textSize={24}
                    style={styles.withoutLogin}
                    text="Üye olmadan devam et"
                    onPress={goWithoutLogin}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
      <Image source={BackgroundImage} style={styles.image} />
    </SafeAreaView>
  );
};

export default LoginRegister;

const styles = StyleSheet.create({
  inputStyle: { fontSize: 22, paddingHorizontal: 16 },
  upper: { flex: 1, justifyContent: 'flex-end', paddingBottom: 36 },
  down: { flex: 2, paddingHorizontal: 16 },
  container: { flex: 1, paddingHorizontal: 24 },
  buttons: { marginTop: 36 },
  button: { marginVertical: 8 },
  withoutLogin: { marginTop: 36 },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    marginVertical: -10,
    marginHorizontal: -10,
    paddingVertical: 10,
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent',
    zIndex: -10,
  },
  // background: { ...StyleSheet.absoluteFillObject, zIndex: -10 },
  title: { color: colors.whiteText, fontSize: 48, fontWeight: '400' },
});
