import { Reducer } from 'redux';

/**
 * bu parametreler useDispatch()
 * hookundan gelen dispatchin icine verdigimiz
 * fonksiyonun aldigi parametreler
 */
interface ActionParams extends ReducerState {
  //
  login: { email: string; password: string; from: 'register' | 'login' };
}

/**
 * Bu tip dispatch fonksiyonunu
 * parametre olarak alan
 * fonksiyonu donduren fonksiyonun tipi
 */

/**
 * Ilgili reducer fonksiyonunun tipi
 */
type ReducerType = Reducer<ReducerState, Actions>;

/**
 * Ilgili redux statei
 */
interface ReducerState {
  email?: string;
  password?: string;
  isLoggedIn: boolean;
  token?: string;
}

// Action Tipleri
type LoginAction = {
  type: 'AUTH';
  payload?: { email: string; password: string };
};
type AuthSuccessAction = {
  type: 'AUTH_SUCCESS';
  payload?: { email: string; token: string };
};
type AuthFailedAction = {
  type: 'AUTH_FAILED';
  payload?: undefined;
};

type Actions = LoginAction | AuthSuccessAction | AuthFailedAction;

type ActionCreator = (params: any) => Actions;
