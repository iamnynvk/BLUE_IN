import React, {useRef} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {Portal} from 'react-native-paper';
import Animated from 'react-native-reanimated';

const BottomSheet = () => {
  const bottomSheetHeight = Dimensions.get('window').height;
  const bottomSheetWeight = Dimensions.get('window').width;
  //   const bottom = useRef(new Animated.value(0)).current;

  return (
    <Portal>
      <Animated.View
        style={[
          styles.container,
          {
            height: 120,
            bottom: 0,
            shadowOffset: {
              height: -3,
            },
          },
          styles.common,
        ]}>
        <View
          style={[
            styles.header,
            {
              shadowOffset: {
                height: 3,
              },
            },
          ]}></View>
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      x: -3,
      y: 0,
    },
  },
  header: {
    height: 33,
    backgroundColor: '#fff',
  },
  common: {
    shadowColor: '#000',
    shodowOffset: {
      width: 0,
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 3,
  },
});
export default BottomSheet;
