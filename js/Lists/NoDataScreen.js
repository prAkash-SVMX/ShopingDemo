import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoDataScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Data Available</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default NoDataScreen;
