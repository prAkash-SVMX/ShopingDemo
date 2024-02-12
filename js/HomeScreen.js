import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {initializeApp} from 'firebase/app';
import {getDatabase, ref, onValue} from 'firebase/database';
import {firebaseConfig} from './firebase/config';
import {useDispatch} from 'react-redux';
import {addItem} from './Action/action';
import ShoppingCard from './ItemList';
import OptionMenu from './OptionMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {signOut, getAuth} from 'firebase/auth'; // Import your signOut function
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook

export default function HomeScreen(props) {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Use useNavigation hook
  const [user, setUser] = useState(null);
  
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <OptionMenu onSignOut={handleSignOut} />, // Pass handleSignOut function to OptionMenu
    });
  }, [props.navigation]);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(userData => {
        if (!userData) {
          throw new Error('User data not found');
        }
        const user = JSON.parse(userData);
        setUser(user);
      })
      .catch(error => {
        console.error('User data error:', error);
        navigation.navigate('Login');
      });

    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db, '/Items');

    onValue(reference, snapshot => {
      const data = snapshot.val();
      dispatch(addItem(data?.products));
      setProductData(data?.products);
      setLoading(false);
    });

    return () => {
      // Cleanup function
    };
  }, [dispatch]);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth) // Call the signOut function
      .then(() => {
        // Clear user data from AsyncStorage
        AsyncStorage.removeItem('user');
        // Navigate to the login screen
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Sign out error:', error);
      });
  };

  const handleNavigation = () => {
    // Navigate to the desired screen
    navigation.navigate('ListView');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={productData}
        renderItem={({item, index}) => (
          <ShoppingCard item={item} index={index} id={item.id} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleNavigation}>
        <Image
          source={require('../assets/Hamburger_icon.png')}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'transparent',
  },
  image: {
    width: 50,
    height: 50,
  },
});