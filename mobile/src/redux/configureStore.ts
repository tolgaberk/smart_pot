import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, createStore } from 'redux';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import authReducer from './auth/authReducer';
import { ActionCreator, AllActions, AllReduxState } from './ReduxTypes';
import { composeWithDevTools } from 'redux-devtools-extension';

export const rootReducer = combineReducers({
  authState: authReducer,
});

const persistConfig: PersistConfig<AllReduxState> = {
  key: 'PERSIST_KEY',
  storage: AsyncStorage,
};

const reducer = persistReducer<AllReduxState, AllActions>(
  persistConfig,
  rootReducer,
);

const store = createStore(reducer, composeWithDevTools());

const persistor = persistStore(store);

const getReduxState = () => store.getState();

const asyncDispatch = async (fn: ReturnType<ActionCreator>) =>
  await fn(store.dispatch, store.getState());

export { store, persistor, getReduxState, asyncDispatch };
