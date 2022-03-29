import React, {useState, useEffect, useRef} from 'react';
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
import {NAVIGATION, SIZES} from '../../constants';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const FirstScreen = ({navigation}) => {
  const [isScanning, setIsScanning] = useState(false);
  const peripheralsData = new Map();

  // you can add device in array to connect only in list
  const deviceList = ['HOPS_CARDIO', 'Medical'];

  // check app state
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const startScan = () => {
    if (!isScanning) {
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

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const bleDiscoverPeripheral = peripherals => {
    const {name} = peripherals;

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

  useEffect(() => {
    BleManager.start();
    startScan();
  }, [isScanning]);

  useEffect(() => {
    // BleManager.start();
    // Bluetooth Turn on & Start Scanning
    // startScan();

    // Bluetooth Device Find & Connect
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      bleDiscoverPeripheral,
    );

    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);

    return () => {
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
    };
  }, []);

  // Checking Platform and given permission
  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission access -->', result);
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

  useEffect(() => {
    let _data;
    const subscriber = AppState.addEventListener('change', nextAppState => {
      console.log('-----------------------> :', nextAppState);
      _data = nextAppState;
    });

    // bluetooth device get Data
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      data => {
        _data === 'active'
          ? console.log('Recieve Data from HOPS_CARDIO :', data.value)
          : BleManager.disconnect(peripheralsData.get(data.peripheral).id);
      },
    );

    return () => {
      subscriber.remove();
    };
  }, []);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SIZES.base * 2,
      }}>
      <Text style={{fontFamily: 'OpenSans-Medium'}}>
        Bluetooth : {isScanning ? 'on' : 'off'}
      </Text>

      <Text>Current State : {appStateVisible}</Text>
    </View>
  );
};

export default FirstScreen;
