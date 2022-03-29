import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CardView = ({
  style,
  firstPress,
  secendPress,
  iconFirstName,
  iconSecendName,
  valueOne,
  valueOneUnit,
  valueTwo,
  valueTwoUnit,
}) => {
  return (
    <View style={[styles.mainView, style]}>
      <View style={styles.touchView}>
        <TouchableOpacity
          onPress={firstPress}
          style={{
            flex: 1,
          }}>
          <View style={styles.iconView}>
            <FontAwesome5 name={iconFirstName} size={50} color="#000" />
          </View>

          {/* Temprature here */}
          <View style={[styles.textView]}>
            <View>
              <Text style={styles.numText}>{valueOne} </Text>
            </View>

            <View>
              <Text style={styles.unitText}>{valueOneUnit}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.touchView}>
        <TouchableOpacity
          onPress={secendPress}
          style={{
            flex: 1,
          }}>
          <View style={styles.iconView}>
            <FontAwesome5 name={iconSecendName} size={50} color="#000" />
          </View>

          {/* spo2 here */}
          <View style={[styles.textView]}>
            <View>
              <Text style={styles.numText}>{valueTwo}</Text>
            </View>

            <View>
              <Text style={styles.unitText}>{valueTwoUnit}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    height: 200,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  touchView: {
    flex: 1,
    borderWidth: 0.5,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 25,
  },
  iconView: {
    marginTop: 10,
    marginHorizontal: 30,
    marginVertical: 10,
  },
  textView: {
    marginTop: 30,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  numText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 40,
    alignSelf: 'center',
    color: '#000',
  },
  unitText: {
    marginTop: 30,
    fontFamily: 'OpenSans-Medium',
    fontSize: 20,
  },
});

export default CardView;
