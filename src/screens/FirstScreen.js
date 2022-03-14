import {
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import BleManager from 'react-native-ble-manager';
import {NAVIGATION} from '../constants';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const FirstScreen = ({navigation}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scan, setScan] = useState(false);

  const delay = milliseconds => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          console.log('Click button');

          //   await BleManager.scan([], 3, false, {});
          //   await delay(3000);
          //   var discoveredPeripherals = await BleManager.getDiscoveredPeripherals(
          //     [],
          //   );
          console.log('discoveredPeripherals', discoveredPeripherals);
        }}>
        <Text style={{fontSize: 30}}>FirstScreen</Text>
      </TouchableOpacity>

      <Text
        onPress={() => {
          navigation.navigate(NAVIGATION.HOME);
        }}>
        Go to HomeScreen
      </Text>
    </View>
  );
};

export default FirstScreen;
