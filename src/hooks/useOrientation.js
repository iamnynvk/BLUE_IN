import React, {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';

// check screen is portrait or landscape
const isPortrait = () => {
  const dimen = Dimensions.get('screen');
  return dimen.height >= dimen.width;
};

const useOrientation = () => {
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'));

  useEffect(() => {
    const onChange = result => {
      setScreenInfo(result.screen);
    };

    Dimensions.addEventListener('change', onChange);

    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  return {
    ...screenInfo,
    isPortrait: isPortrait(),
  };
};

export default useOrientation;
