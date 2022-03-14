import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import Provider from './src/navigation/index';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'If you want to use Reanimated 2 then go through our installation steps https://docs.swmansion.com/react-native-reanimated/docs/installation',
  'Warning: Failed prop type: Invalid props.style key `weight` supplied to `LottieView`.',
  'If you want to use Reanimated 2 then go through our installation steps https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation',
  "ProgressBarAndroid has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-community/progress-bar-android' instead of 'react-native'. See https://github.com/react-native-progress-view/progress-bar-android",
  'EventEmitter.removeListener',
]);

const App = () => {
  // Splashscreen
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return <Provider />;
};

export default App;
