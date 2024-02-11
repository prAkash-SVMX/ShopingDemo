import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const NetworkErrorFallback = () => {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/network_error.png')} style={styles.image} />
      <Text style={styles.text}>Oops! Something went wrong.</Text>
      <Text style={styles.text}>Please check your internet connection and try again.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 10,
  },
});

export default NetworkErrorFallback;
