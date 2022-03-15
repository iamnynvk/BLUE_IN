import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  NativeModules,
  NativeEventEmitter,
  ProgressBarAndroid,
  Platform,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {images, NAVIGATION, SIZES} from '../constants';
import useOrientation from '../hooks/useOrientation';
import BottomSheet from 'reanimated-bottom-sheet';
import {DEVICES} from '../../assets/data/DummyData';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const HomeScreen = ({navigation}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scan, setScan] = useState(false);
  const sheetRef = useRef();

  const peripherals = new Map();
  const [list, setList] = useState([]);

  // Screen change listener using hooks
  const orientation = useOrientation();
  const screen = orientation.isPortrait;

  useEffect(() => {
    BleManager.start();

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }
  }, []);

  const startScanning = () => {
    sheetRef?.current?.snapTo(0);
    if (!scan) {
      setIsScanning(true);
      console.log('Start Scan now');
      BleManager.scan([], 10, false, {}).then(result => {
        console.log('result', result);
        setScan(true);
      });
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerOpen}>
        <View style={styles.pannelHeader}>
          <View style={styles.pannelHandle}></View>
        </View>
      </View>
    );
  };

  const renderDeviceList = item => {
    return (
      <View>
        <TouchableOpacity style={styles.selectDevice}>
          <Text style={styles.device}>{item.item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.renderMainView}>
        <View style={{marginHorizontal: SIZES.base * 2}}>
          <Text style={styles.text}>Select Devices</Text>
          {isScanning ? (
            <ProgressBarAndroid styleAttr="Horizontal" color="#32617b" />
          ) : (
            <></>
          )}
        </View>

        <FlatList
          data={DEVICES}
          keyExtractor={item => item.id}
          renderItem={item => renderDeviceList(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={['60%', 0]}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={1}
        enabledGestureInteraction={true}
      />

      <View style={[styles.textView, {flex: 1}]}>
        <Text
          style={styles.textConnect}
          onPress={() => {
            navigation.navigate(NAVIGATION.BLUETOOTH);
          }}>
          Please Turn on bluetooth
        </Text>
      </View>

      {/* Start Scan Button */}
      <View style={{flex: 5, justifyContent: 'center'}}>
        {isScanning ? (
          <View style={styles.buttonActionStyle}>
            <TouchableOpacity
              onPress={() => {
                console.log('stop');
                setIsScanning(false);
                sheetRef?.current?.snapTo(1);

                if (isScanning) {
                  BleManager.stopScan().then(() => {
                    console.log('stop scan');
                    setScan(false);
                  });
                }
              }}>
              <LottieView
                source={require('../../assets/animated/bluetooth.json')}
                autoPlay
                loop
                height={SIZES.height * 0.5}
                weight={SIZES.width * 0.2}
                style={styles.lottieButton}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonStartStyle}>
            <TouchableOpacity
              style={{
                height: SIZES.base * 10,
                weight: SIZES.base * 10,
                justifyContent: 'center',
              }}
              onPress={startScanning}>
              <Text style={styles.text}>START SCAN</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* End Scan Button */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center',
          marginHorizontal: SIZES.base * 2,
          marginVertical: SIZES.base * 2,
          backgroundColor: '#fff',
          borderRadius: 50,
        }}>
        <View style={{marginStart: 50}}>
          <TouchableOpacity style={{alignItems: 'center'}}>
            <Image
              source={images.list}
              resizeMode={'center'}
              height={50}
              weight={50}
            />
            <Text style={{}}>List Device</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginEnd: 50}}>
          <TouchableOpacity style={{alignItems: 'center'}}>
            <Image
              source={images.access}
              resizeMode={'contain'}
              height={30}
              weight={30}
            />
            <Text style={{}}>Access Device</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#32617b',
  },
  textView: {
    margin: SIZES.base * 2,
  },
  textConnect: {
    fontSize: SIZES.base * 2.5,
    fontFamily: 'OpenSans-Medium',
    color: '#fff',
  },
  buttonActionStyle: {
    borderRadius: SIZES.height * 0.5,
  },
  text: {
    fontSize: SIZES.base * 2,
    color: '#7b9694',
  },
  lottieButton: {
    alignSelf: 'center',
    height: SIZES.height * 0.5,
    weight: SIZES.width * 0.2,
  },
  buttonStartStyle: {
    marginVertical: SIZES.height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: SIZES.base * 5,
    height: SIZES.base * 10,
    weight: SIZES.base * 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      x: 0,
      y: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
  },
  listDevice: {
    margin: SIZES.base * 2,
    height: SIZES.height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  headerOpen: {
    backgroundColor: '#fff',
    shadowColor: '#333333',
    shadowOpacity: {
      width: -1,
      height: -3,
    },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pannelHeader: {
    alignItems: 'center',
  },
  pannelHandle: {
    width: 40,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 20,
  },
  renderMainView: {
    backgroundColor: 'white',
    height: SIZES.height * 0.6,
    borderColor: 'white',
    borderWidth: 2,
  },
  selectDevice: {
    marginHorizontal: SIZES.base * 2,
    marginVertical: SIZES.base * 1,
    height: SIZES.height * 0.03,
  },
  device: {
    color: '#000',
    fontFamily: 'OpenSans-Regular',
  },
});

export default HomeScreen;
