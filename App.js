import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import Provider from './src/navigation/index';

const App = () => {
  // Splashscreen
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return <Provider />;
};

export default App;
