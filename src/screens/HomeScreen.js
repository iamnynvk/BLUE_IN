import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  AppState,
  Dimensions,
} from 'react-native';
import {NAVIGATION} from '../constants/navigation';
import useOrientation from '../hooks/useOrientation';
import {AuthContext} from '../navigation/AuthProvider';
// import {DATA} from '../../assets/data/DummyData';

const Homescreen = ({navigation}) => {
  const {fatchingData, data} = useContext(AuthContext);

  // using hook for check screen is portrait or landscape
  const orientation = useOrientation();
  const screen = orientation.isPortrait;

  // screen wise data render card
  const numCols = screen ? 2 : 3;
  const WIDTH = Dimensions.get('window').width;

  const menImage = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';
  const womanImage =
    'https://icons-for-free.com/iconfiles/png/512/female+person+user+woman+young+icon-1320196266256009072.png';

  useEffect(() => {
    fatchingData();
  }, []);

  const renderItem = item => {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(NAVIGATION.DETAIL, {
              patientFirstName: item.firstName,
              patientLastName: item.lastName,
              patientID: item.patientId,
              MACAddress: item.MACAddress,
            });
          }}>
          <View style={[styles.childContainer]}>
            <View style={{marginTop: 10}}>
              <Image
                source={{uri: item?.gender === 'male' ? menImage : womanImage}}
                style={styles.imageSet}
              />
            </View>

            <View style={styles.textView}>
              <Text style={styles.textStyle}>
                {item.firstName} {item.lastName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        key={numCols}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        numColumns={numCols}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => renderItem(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F2F3',
    padding: 10,
  },
  childContainer: {
    flex: 1,
    alignItems: 'center',
    height: 220,
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 0.5,
    margin: 2,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  imageSet: {
    height: 160,
    width: 160,
    borderRadius: 80,
    borderWidth: 0.5,
    borderColor: '#000',
  },
  textView: {
    marginTop: 5,
    alignItems: 'center',
  },
  textStyle: {
    color: 'black',
    fontFamily: 'OpenSans-Medium',
    marginTop: 5,
  },
});

export default Homescreen;
