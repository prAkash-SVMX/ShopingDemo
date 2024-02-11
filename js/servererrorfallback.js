import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

const ErrorFallback = ({errorMessage, onClose}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/servererror.png')}
        style={styles.image}
      />
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>login</Text>
      </TouchableOpacity>
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF5733',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorFallback;
