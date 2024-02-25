import React, {useState} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import {useDispatch} from 'react-redux';
import {firebaseConfig} from '../firebase/config';
import {initializeApp} from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  get,
  query,
  equalTo,
  onValue,
} from 'firebase/database';
import {AddUserData} from '../Action/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import Toast from 'react-native-toast-message'; // Import Toast component

export default function RegistrationScreen({navigation}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();

  let firebaseApp;
  firebaseApp = initializeApp(firebaseConfig);
  let firebaseAuth = getAuth();

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    setLoading(true); // Set loading to true on button press
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('User signed up:', user);
        AsyncStorage.setItem(
          'user',
          JSON.stringify({
            ...userCredential,
            username: username,
            email: email,
            fullName: fullName,
          }),
        );
        let db = getDatabase();

        const emailref = ref(db, '/userByMail');
        // onValue(emailref, snapshot => {
        //   emaildata = {...snapshot.val()};
        // });
        const replacedStr = email.replace(/\./g, '^');
        // console.log('user email', emaildata);
        // const newData = {...emaildata};
        // newData[replacedStr] = username;
        // set(emailref, {...newData});
        get(emailref)
          .then(snapshot => {
            const existingData = snapshot.val() || {}; // If no data, default to empty object
            const replacedStr = email.replace(/\./g, '^');

            // Merge existing data with new data
            const newData = {
              ...existingData,
              [replacedStr]: username,
            };

            // Set the merged data back to the database
            set(emailref, newData)
              .then(() => {
                console.log('New data inserted successfully');
              })
              .catch(error => {
                console.error('Error inserting new data:', error);
              });
          })
          .catch(error => {
            console.error('Error fetching existing data:', error);
          });
        console.log('username', username);
        const refrence = ref(db, `/userData/${username}`);
        console.log('ref', refrence);
        set(refrence, {username: username, email: email, fullName: fullName});
        dispatch(
          AddUserData({username: username, email: email, fullName: fullName}),
        );
        navigation.navigate('Home');
      })
      .catch(error => {
        console.error('Sign up error:', error);
        setLoading(false); // Set loading to false on error
        // Show toast message for error
        Toast.show({
          type: 'error',
          text1: 'Sign Up Error',
          text2: error.message || 'Sign up failed',
          position: 'bottom',
          visibilityTime: 4000,
          autoHide: true,
        });
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setUsername(text)}
          value={username}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={onRegisterPress}
          disabled={loading} // Disable button when loading is true
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonTitle}>Create account</Text>
          )}
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
      <Toast ref={ref => Toast.setRef(ref)} />
    </View>
  );
}
