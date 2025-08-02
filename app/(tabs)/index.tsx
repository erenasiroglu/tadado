import React from "react";
import { Image } from 'react-native';

export default function HomeScreen() {
  return (
    <Image
      style={{ width: 200, height: 200, alignSelf: 'center', justifyContent: 'center' }}
      resizeMode="contain"
      source={require('@/assets/images/react-logo.png')}
    />
  );
}
    
