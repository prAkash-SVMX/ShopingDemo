import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebaseConfig} from '../firebase/config';
import styles from './styles';
import {onValue,getDatabase, ref} from 'firebase/database';

// Import Toast component from react-native-toast-message
import Toast from 'react-native-toast-message';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  initializeApp(firebaseConfig);
  let firebaseAuth = getAuth();
  // useEffect(() => {

  // }, []);

  const onLoginPress = () => {
    setLoading(true);
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then(userCredential => {
        let emaildata = {};
        const replacedStr = email.replace(/\./g, '^');
        let db = getDatabase();
        const emailref = ref(db, '/userByMail');
        onValue(emailref, snapshot => {
          emaildata = {...snapshot.val()};
        });
        console.log(
          'user',
          JSON.stringify({
            ...userCredential.user,
            email: email,
            username: emaildata[replacedStr],
          }),
        );
        AsyncStorage.setItem(
          'user',
          JSON.stringify({
            ...userCredential.user,
            email: email,
            username: emaildata[replacedStr],
          }),
        );
        navigation.navigate('Home');
      })
      .catch(error => {
        // Handle login error here
        console.log('error', error);
        setError('Login failed. Please check your credentials.');
        // Show toast message for error
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: error.message || 'Login failed',
          position: 'bottom',
          visibilityTime: 4000,
          autoHide: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const onFooterLinkPress = () => {
    navigation.navigate('Registration');
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setEmail(text)}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={onLoginPress}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonTitle}>Log in</Text>
          )}
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
      {/* Toast component for displaying error messages */}
      <Toast ref={ref => Toast.setRef(ref)} />
    </View>
  );
}
