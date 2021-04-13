import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Calendar, Membership, Vase } from './assets/icons';
import colors from './config/colors';
import useReduxSelector from './hooks/useReduxSelector';
import { logoutAction } from './redux/auth/authActions';
import { asyncDispatch } from './redux/configureStore';
import FlowerDetail from './screens/FlowerDetail';
import FlowersList from './screens/FlowersList';
import LoginRegister from './screens/LoginRegister';
import MyMembership from './screens/MyMembership';
import MyPot from './screens/MyPot';
import MyPots from './screens/MyPots';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Router() {
  const theme = {
    dark: false,
    colors: {
      background: colors.background,
      border: 'black',
      primary: colors.primary,
      card: colors.card,
      notification: colors.white,
      text: colors.text,
    },
  };
  return (
    <NavigationContainer theme={theme}>{RootNavigator()}</NavigationContainer>
  );
}

const CustomDrawer = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  const filteredProps = {
    ...props,
    state: {
      ...props.state,
      routeNames: props.state.routeNames.filter(
        (routeName) => routeName !== 'FlowerDetail' && routeName !== 'MyPot',
      ),
      routes: props.state.routes.filter(
        (route) => route.name !== 'FlowerDetail' && route.name !== 'MyPot',
      ),
    },
  };
  return (
    <DrawerContentScrollView {...filteredProps}>
      <DrawerItemList {...filteredProps} />
      <Pressable
        style={styles.cikisYapButton}
        onPress={async () => {
          await asyncDispatch(logoutAction());
          console.log(props.navigation.navigate('Login'));
        }}>
        <Text style={{ color: colors.whiteText }}>Çıkış yap</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
};

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={CustomDrawer} detachInactiveScreens>
      <Drawer.Screen
        options={{
          drawerLabel: 'Çiçek ve Bitkiler',
          drawerIcon: ({ color }) => <Calendar color={color} />,
        }}
        name="Flowers"
        component={FlowersList}
      />
      <Drawer.Screen
        options={{
          drawerLabel: 'Üyeliğim',
          drawerIcon: ({ color }) => <Membership color={color} />,
        }}
        name="MyMembership"
        component={MyMembership}
      />
      <Drawer.Screen
        options={{
          drawerLabel: 'Saksılarım',
          drawerIcon: ({ color }) => <Vase color={color} />,
        }}
        name="Pots"
        component={MyPots}
      />
      <Drawer.Screen name="FlowerDetail" component={FlowerDetail} />
      <Drawer.Screen name="MyPot" component={MyPot} />
    </Drawer.Navigator>
  );
}

function RootNavigator() {
  const state = useReduxSelector(({ authState }) => authState);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!state.isLoggedIn && (
        <Stack.Screen name="Login" component={LoginRegister} />
      )}
      <Stack.Screen name="App" component={DrawerNavigator} />
      <Stack.Screen name="Pot" component={MyPot} />
    </Stack.Navigator>
  );
}
export default Router;

const styles = StyleSheet.create({
  cikisYapButton: {
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 8,
  },
});
