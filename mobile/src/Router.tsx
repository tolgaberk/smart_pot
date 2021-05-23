import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Sun, User, Codepen, Feather } from './assets/icons';
import colors from './config/colors';
import generalStyles from './config/generalStyles';
import useReduxSelector from './hooks/useReduxSelector';
import { logoutAction } from './redux/auth/authActions';
import { asyncDispatch, getReduxState } from './redux/configureStore';
import BlogDetail from './screens/BlogDetail';
import Blog from './screens/BlogsList';
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
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const CustomDrawer = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  const nonShownItems = ['FlowerDetail', 'MyPot', 'BlogDetail'];
  const filteredProps = {
    ...props,
    state: {
      ...props.state,
      routeNames: props.state.routeNames.filter(
        (routeName) => !nonShownItems.includes(routeName),
      ),
      routes: props.state.routes.filter(
        (route) => !nonShownItems.includes(route.name),
      ),
    },
  };
  const isLoggedIn = getReduxState().authState.isLoggedIn;
  return (
    <DrawerContentScrollView
      {...filteredProps}
      contentContainerStyle={generalStyles.flex}>
      <DrawerItemList {...filteredProps} />
      <View style={generalStyles.flex} />
      {isLoggedIn ? (
        <Pressable
          style={styles.cikisYapButton}
          onPress={async () => {
            await asyncDispatch(logoutAction());
            props.navigation.navigate('Login');
            props.navigation.dispatch(DrawerActions.closeDrawer());
            props.navigation.dispatch(DrawerActions.jumpTo('Flowers'));
          }}>
          <Text style={{ color: colors.whiteText }}>Çıkış yap</Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.cikisYapButton}
          onPress={async () => {
            props.navigation.navigate('Login');
            props.navigation.dispatch(DrawerActions.closeDrawer());
            props.navigation.dispatch(DrawerActions.jumpTo('Flowers'));
          }}>
          <Text style={{ color: colors.whiteText }}>Giriş yap</Text>
        </Pressable>
      )}
    </DrawerContentScrollView>
  );
};

function DrawerNavigator() {
  const isLoggedIn = getReduxState().authState.isLoggedIn;
  return (
    <Drawer.Navigator drawerContent={CustomDrawer} detachInactiveScreens={true}>
      <Drawer.Screen
        options={{
          drawerLabel: 'Çiçek ve Bitkiler',
          drawerIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Sun color={color} />
            </View>
          ),
        }}
        name="Flowers"
        component={FlowersList}
      />
      {isLoggedIn && (
        <>
          <Drawer.Screen
            options={{
              drawerLabel: 'Üyeliğim',
              drawerIcon: ({ color }) => (
                <View style={styles.iconContainer}>
                  <User color={color} />
                </View>
              ),
            }}
            name="MyMembership"
            component={MyMembership}
          />
          <Drawer.Screen
            options={{
              drawerLabel: 'Saksılarım',
              drawerIcon: ({ color }) => (
                <View style={styles.iconContainer}>
                  <Codepen color={color} />
                </View>
              ),
            }}
            name="Pots"
            component={MyPots}
          />
        </>
      )}
      <Drawer.Screen
        options={{
          drawerLabel: 'Blog',
          drawerIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather color={color} />
            </View>
          ),
        }}
        name="Blog"
        component={Blog}
      />
      <Drawer.Screen name="FlowerDetail" component={FlowerDetail} />
      <Drawer.Screen name="BlogDetail" component={BlogDetail} />
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
    </Stack.Navigator>
  );
}
export default Router;

const styles = StyleSheet.create({
  iconContainer: { width: 30, alignItems: 'center' },
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
