import React, {useState, useEffect, useRef} from 'react';
import {View, Text, AppState, StyleSheet, Image} from 'react-native';
import LottieView from 'lottie-react-native';
import {images, SIZES} from '../constants';
import {TouchableOpacity} from 'react-native-gesture-handler';

const HomeScreen = () => {
  const [isScanning, setIsScanning] = useState(false);

  const AppStates = useRef(AppState.currentState);

  const scanner = () => {
    setIsScanning(true);

    isScanning == 'true' ? setIsScanning(true) : setIsScanning(false);
    setIsScanning(!isScanning);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.textConnect}>Please Turn on bluetooth</Text>
      </View>

      {/* Start Scan Button */}
      <View>
        {isScanning ? (
          <View style={styles.buttonActionStyle}>
            <TouchableOpacity onPress={scanner}>
              <LottieView
                source={require('../../assets/animated/bluetooth.json')}
                autoPlay
                loop
                style={styles.lottieButton}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.buttonStartStyle} onPress={scanner}>
            <View style={styles.buttonView}>
              <Text style={styles.text}>START SCAN</Text>
            </View>
          </TouchableOpacity>
        )}
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
  buttonView: {
    marginVertical: SIZES.height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: SIZES.base * 5,
    height: SIZES.base * 10,
    weight: SIZES.base * 10,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowOffset: {
      x: 0,
      y: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
  },
  buttonActionStyle: {
    borderWidth: 1,
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
    borderWidth: 1,
  },
});

export default HomeScreen;
