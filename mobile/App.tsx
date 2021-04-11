/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import Router from './src/Router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/configureStore';
import { Provider as StoreProvider } from 'react-redux';
const App = () => {
  return (
    <StoreProvider store={store}>
      <PersistGate persistor={persistor}>
        <Router />
      </PersistGate>
    </StoreProvider>
  );
};
export default App;
