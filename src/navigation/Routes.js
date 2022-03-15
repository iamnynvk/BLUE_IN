import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NAVIGATION} from '../constants/navigation';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import FirstScreen from '../screens/FirstScreen';
import BluetoothConnection from '../screens/BluetoothConnection';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={NAVIGATION.BLUETOOTH}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name={NAVIGATION.BLUETOOTH}
          component={BluetoothConnection}
        />
        <Stack.Screen name="Firstscreen" component={FirstScreen} />
        <Stack.Screen name={NAVIGATION.HOME} component={HomeScreen} />
        <Stack.Screen name={NAVIGATION.ABOUT} component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
