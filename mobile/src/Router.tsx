import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import FlowerDetail from './screens/FlowerDetail';
import FlowersList from './screens/FlowersList';
import Home from './screens/Home';
import LoginRegister from './screens/LoginRegister';
import MyPot from './screens/MyPot';
import MyPots from './screens/MyPots';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        <Stack.Screen name="FlowersList" component={FlowersList} />
        <Stack.Screen name="FlowerDetail" component={FlowerDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Router;

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="LoginRegister" component={LoginRegister} />
      <Drawer.Screen name="MyPot" component={MyPot} />
      <Drawer.Screen name="MyPots" component={MyPots} />
    </Drawer.Navigator>
  );
}
