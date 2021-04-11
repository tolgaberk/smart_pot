import { Alert } from 'react-native';
import Api from '../../Api';
import { ActionCreator } from '../ReduxTypes';
import { ActionParams } from './types';

export const authAction: ActionCreator<ActionParams> = () => (_dispatch) => {};

export const loginAction: ActionCreator<ActionParams['login']> = (
  params,
) => async (dispatch) => {
  dispatch({
    type: 'AUTH',
    payload: { email: params.email, password: params.password },
  });
  let res;
  if (params.from === 'login') {
    try {
      res = await Api.feathers.authenticate({
        strategy: 'local',
        email: params.email,
        password: params.password,
      });
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { email: params.email, token: res?.accessToken },
      });
    } catch (err) {
      Alert.alert('HATA', 'Giriş bilgilerinizi kontrol ediniz', [
        { text: 'Tamam' },
      ]);
      dispatch({ type: 'AUTH_FAILED' });
      throw 'error';
    }
  } else {
    try {
      await Api.feathers.service('users').create(params);
      res = await Api.feathers.authenticate({
        strategy: 'local',
        email: params.email,
        password: params.password,
      });
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { email: params.email, token: res?.accessToken },
      });
    } catch (err) {
      Alert.alert('HATA', 'Daha önce üye olmadığınızdan emin olunuz.', [
        { text: 'Tamam' },
      ]);
      dispatch({ type: 'AUTH_FAILED' });
      throw 'error';
    }
  }
};
