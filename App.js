/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './js/LoginScreen/LoginScreen';
import HomeScreen from './js/HomeScreen';
import RegistrationScreen from './js/RegistrationScreen/RegistrationScreen';
import ListView from './js/Lists/ListHost';
// import {decode, encode} from 'base-64';
// if (!global.btoa) {
//   global.btoa = encode;
// }
// if (!global.atob) {
//   global.atob = decode;
// }

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* {user ? ( */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* ) : ( */}
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="ListView" component={ListView} />
        </>
        {/* )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
