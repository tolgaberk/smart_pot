/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import Router from './src/Router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/configureStore';
import { Provider as StoreProvider } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/tr';
import { StatusBar } from 'react-native';
import colors from './src/config/colors';
import { Loader } from './src/components/Loader';
import Api from './src/Api';
import SplashScreen from 'react-native-splash-screen';
dayjs.extend(relativeTime);
dayjs.locale('tr');

const App = () => {
  useEffect(() => {
    StatusBar.setBackgroundColor(colors.background);
    StatusBar.setBarStyle('dark-content');
    SplashScreen.hide();
    Api.init();
  }, []);
  return (
    <StoreProvider store={store}>
      <PersistGate persistor={persistor} loading={<Loader />}>
        <Router />
      </PersistGate>
    </StoreProvider>
  );
};
export default App;
