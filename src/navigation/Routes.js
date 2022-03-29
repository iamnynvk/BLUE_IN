import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NAVIGATION} from '../constants/navigation';
import HomeScreen from '../screens/HomeScreen';
import BodyDetailScreen from '../screens/BodyDetailScreen';
import Detailscreen from '../screens/Detailscreen';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={NAVIGATION.HOME}
          component={HomeScreen}
          options={{
            headerTitle: 'Dashboard',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#233975',
            },
          }}
        />
        <Stack.Screen
          name={NAVIGATION.DETAIL}
          component={Detailscreen}
          options={({route}) => ({
            title:
              route.params.patientFirstName +
              ' ' +
              route.params.patientLastName,
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#233975',
            },
          })}
        />
        <Stack.Screen
          name={NAVIGATION.BODYDETAIL}
          component={BodyDetailScreen}
          options={({route}) => ({
            title: route.params.titles,
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#233975',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
