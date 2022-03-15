import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  AppState,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {NAVIGATION, SIZES} from '../constants';

// Modules
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BluetoothConnection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const peripheralsData = new Map();
  const [list, setList] = useState([]);

  const deviceList = ['HOPS_CARDIO', 'Medical'];

  // App State check
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('Next AppState is: ', nextAppState);
        setAppState(nextAppState);
      },
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  // Permission check
  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          // console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept', result);
            } else {
              console.log('User refuse', result);
            }
          });
        }
      });
    }
  }, []);

  // Start Scan Bluetooth
  const startScan = () => {
    if (!isScanning && appState == 'active') {
      console.log('Scaning State : ', appState);
      BleManager.scan([], 10, false)
        .then(() => {
          setIsScanning(true);
          console.log('Scanning Started...');
        })
        .catch(err => {
          console.log('Scaning Failed...', err);
        });
    }
  };

  useEffect(() => {
    BleManager.start();

    startScan();
  }, [appState]);

  // Bluetooth get Data Peripheral
  const bleDiscoverPeripheral = peripherals => {
    const {name} = peripherals;

    console.log('Peripheral Name : ', peripherals);

    if (deviceList.includes(name)) {
      if (peripherals.name != null && peripherals.name == name) {
        peripheralsData.set(peripherals.id, peripherals);

        BleManager.connect(peripherals.id).then(() => {
          console.log('connect to ', peripheralsData.get(peripherals.id).name);

          setTimeout(() => {
            BleManager.retrieveServices(peripherals.id).then(peripheralInfo => {
              let service_uuid = '180d';
              let notify_uuid = '1801';
              let bettery_notify_uuid = '1802';
              let position_notify_uuid = '1803';

              peripheralInfo.characteristics.map(Item => {
                if (Item.service === service_uuid) {
                  console.log('service ID : ', Item);

                  BleManager.startNotification(
                    peripherals.id,
                    service_uuid,
                    notify_uuid,
                  ).then(() => {
                    console.log(
                      'startNotification Start ==> ' + peripherals.id,
                    );
                  });
                }
              });
            });
          }, 500);
        });
      }
    }
  };

  const handleDisconnectedPeripheral = data => {
    let peripheral = peripheralsData.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripheralsData.set(data.peripheral, peripheral);
      setList(Array.from(peripheralsData.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  useEffect(() => {
    // Bluetooth Device Find & Connect
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      bleDiscoverPeripheral,
    );

    // Bluetooth Device Disconnect
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );

    return () => {
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        bleDiscoverPeripheral,
      );

      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
    };
  }, []);

  // Bluetooth Device Data Print
  const handleUpdateValueForCharacteristic = data => {
    appState === 'active'
      ? console.log('Recieve Data from HOPS_CARDIO :', data.value)
      : BleManager.disconnect(peripheralsData.get(data.peripheral).id);
  };

  useEffect(() => {
    // bluetooth device get Data
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );

    return () => {
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      );
    };
  }, []);

  return (
    <View>
      <Text
        style={{
          fontFamily: 'OpenSans-Medium',
          fontSize: 30,
          alignSelf: 'center',
          marginTop: SIZES.base * 2,
        }}>
        Bluetooth : {isScanning ? 'on' : 'off'}
      </Text>
    </View>
  );
};

export default BluetoothConnection;
