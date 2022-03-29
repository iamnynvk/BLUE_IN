import React from 'react';
import {AuthProvider} from './AuthProvider';
import {StatusBar} from 'react-native';
import {LogBox} from 'react-native';
import Routes from './Routes';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  "EventEmitter.removeListener('change', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.",
  'Encountered two children with the same key, `:`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.',
]);

const index = () => {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor="#233975" />
      <Routes />
    </AuthProvider>
  );
};

export default index;
