import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  NativeModules,
  NativeEventEmitter,
  AppState,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ScrollView,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {NAVIGATION, SIZES} from '../constants';
import CardView from '../components/CardView';

// Modules
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Detailscreen = props => {
  const [isScanning, setIsScanning] = useState(false);
  const peripheralsData = new Map();
  const [list, setList] = useState([]);
  const [getID, setGetID] = useState();

  const deviceList = ['HOPS_CARDIO', 'Medical'];

  const {patientID, MACAddress} = props.route.params;

  const [patientData, setPatientData] = useState([]);
  const [temp, setTemp] = useState();
  const [spo2, setSpo2] = useState();
  const [bp, setBp] = useState();
  const [weight, setWeight] = useState();
  const [glucose, setGlucose] = useState();
  const [pulse, setPulse] = useState();

  // Data fetching from API
  useEffect(() => {
    fetch(
      `http://167.71.225.187:9000/vitals/${patientID}/${MACAddress}/lastVitals/`,
    ).then(res => {
      res.json().then(data => {
        setPatientData(data.payload);

        const DetailData = data.payload;

        DetailData.map(item => {
          if (item.vital == 'temp') {
            setTemp(item.value1);
          } else if (item.vital == 'spo2') {
            setSpo2(item.value1);
            setPulse(item.value2);
          } else if (item.vital == 'bp') {
            setBp(item.value1);
          } else if (item.vital == 'weight') {
            setWeight(item.value1);
          } else if (item.vital == 'glucose') {
            setGlucose(item.value1);
          }
        });
      });
    });
  }, []);

  // App State check
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    console.log('id', getID);
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('current AppState is: ', nextAppState);
        setAppState(nextAppState);

        if (nextAppState === 'background') {
          console.log('App is in background');
          BleManager.stopScan();
          console.log('user ID :', getID);
          BleManager.disconnect(getID);
        } else if (nextAppState === 'active') {
          console.log('user ID :', getID);
          BleManager.start();
          startScan();
        }
      },
    );

    return () => {
      appStateListener.remove();
    };
  }, [getID]);

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
    if (!isScanning) {
      BleManager.scan([], 10, false)
        .then(() => {
          setIsScanning(true);
          console.log('Scanning Started...');
          console.log('is running : ', !isScanning);
        })
        .catch(err => {
          console.log('Scaning Failed...', err);
        });
    }
  };

  useEffect(() => {
    BleManager.start();

    startScan();

    return () => {
      BleManager.stopScan();
      BleManager.disconnect(getID);
    };
  }, [getID]);

  // Bluetooth get Data Peripheral
  const bleDiscoverPeripheral = peripherals => {
    const {name} = peripherals;

    if (deviceList.includes(name)) {
      if (peripherals.name != null && peripherals.name == name) {
        if (peripherals?.connected) {
          BleManager.disconnect(peripherals.id);

          ToastAndroid.showWithGravity(
            'You are already connected to ' +
              peripheralsData.get(peripherals.id).name,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        } else {
          setGetID(peripherals.id);

          peripheralsData.set(peripherals.id, peripherals);

          BleManager.connect(peripherals.id).then(() => {
            let p = peripheralsData.get(peripherals.id);
            if (p) {
              console.log('This is p Value :::::::::::>>>>', p);
              p.connected = true;
              peripheralsData.set(peripherals.id, p);
              setList(Array.from(peripheralsData.values()));
              console.log(
                'connect to ',
                peripheralsData.get(peripherals.id).name,
              );
              ToastAndroid.showWithGravity(
                'You are connected to ' +
                  peripheralsData.get(peripherals.id).name,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              BleManager.stopScan();
            }

            if (peripherals?.name == 'HOPS_CARDIO') {
              setTimeout(() => {
                BleManager.retrieveServices(peripherals.id)
                  .then(peripheralInfo => {
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
                        )
                          .then(() => {
                            console.log(
                              'startNotification Start ==> ' + peripherals.id,
                            );
                          })
                          .catch(err => {
                            console.log('startNotification Error : ', err);
                          });
                      }
                    });
                  })
                  .catch(err => {
                    console.log("Can't get service info", err);
                  });
              }, 500);
            } else if (peripherals?.name == 'Medical') {
              setTimeout(() => {
                BleManager.retrieveServices(peripherals.id)
                  .then(peripheralInfo => {
                    let service_uuid = 'cdeacb80-5235-4c07-8846-93a37ee6b86d';
                    let notify_uuid = 'cdeacb81-5235-4c07-8846-93a37ee6b86d';

                    peripheralInfo.characteristics.map(Item => {
                      if (Item.service === service_uuid) {
                        console.log('service ID : ', Item);

                        BleManager.startNotification(
                          peripherals.id,
                          service_uuid,
                          notify_uuid,
                        )
                          .then(() => {
                            console.log(
                              'startNotification Start ==> ' + peripherals.id,
                            );
                          })
                          .catch(err => {
                            console.log('startNotification Error : ', err);
                          });
                      }
                    });
                  })
                  .catch(err => {
                    console.log("Can't get service info", err);
                  });
              }, 500);
            }
          });
        }
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

    return () => {
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        bleDiscoverPeripheral,
      );
    };
  }, []);

  useEffect(() => {
    // Bluetooth Device Disconnect
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    return () => {
      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
    };
  }, [getID]);

  // Bluetooth Device Data Print
  function ByteArray(data) {
    if (toHexString(byteToHex(data[0])) === '81') {
      let pulse = parseInt(toHexString(byteToHex(data[1])), 16);
      let spo2 = parseInt(toHexString(byteToHex(data[2])), 16);
      let pi = parseInt(toHexString(byteToHex(data[3])), 16) / 10;
      console.log('>>>>>>>>>>', pulse, spo2, pi);
    }
  }

  function byteToHex(byte) {
    const unsignedByte = byte & 0xff;
    return unsignedByte.toString(16);
  }

  function toHexString(bytes) {
    return Array.from(bytes)
      .map(byte => byteToHex(byte))
      .join('');
  }

  const handleUpdateValueForCharacteristic = data => {
    appState === 'active'
      ? ByteArray(data.value)
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
  }, [getID]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <CardView
          firstPress={() => {
            props.navigation.navigate(NAVIGATION.BODYDETAIL, {
              patientID,
              MACAddress,
              vital: 'temp',
              titles: 'Temperature',
            });
          }}
          iconFirstName="temperature-low"
          valueOne={temp ? temp : '-'}
          valueOneUnit="°F"
          secendPress={() => {
            props.navigation.navigate(NAVIGATION.BODYDETAIL, {
              patientID,
              MACAddress,
              vital: 'spo2',
              titles: 'SpO2',
            });
          }}
          iconSecendName="heart"
          valueTwo={spo2 ? spo2 : '-'}
          valueTwoUnit="%"
        />

        <CardView
          style={{marginTop: 10}}
          firstPress={() => {
            props.navigation.navigate(NAVIGATION.BODYDETAIL, {
              patientID,
              MACAddress,
              vital: 'spo2',
              titles: 'Pulse',
            });
          }}
          iconFirstName="heartbeat"
          valueOne={pulse ? pulse : '-'}
          valueOneUnit="bpm"
          secendPress={() => {
            props.navigation.navigate(NAVIGATION.BODYDETAIL, {
              patientID,
              MACAddress,
              vital: 'weight',
              titles: 'Weight',
            });
          }}
          iconSecendName="dumbbell"
          valueTwo={weight ? weight : '-'}
          valueTwoUnit="kg"
        />

        <CardView
          style={{marginTop: 10}}
          firstPress={() => {
            props.navigation.navigate(NAVIGATION.BODYDETAIL, {
              patientID,
              MACAddress,
              vital: 'glucose',
              titles: 'Glucose',
            });
          }}
          iconFirstName="calendar-check"
          valueOne={glucose ? glucose : '-'}
          valueOneUnit="mg/mL"
          secendPress={() => {
            props.navigation.navigate(NAVIGATION.BODYDETAIL, {
              patientID,
              MACAddress,
              vital: 'bp',
              titles: 'Blood Pressure',
            });
          }}
          iconSecendName="eye-dropper"
          valueTwo={bp ? bp : '-'}
          valueTwoUnit="mmHg"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F2F3',
    padding: 10,
    justifyContent: 'center',
  },
});

export default Detailscreen;
