import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const OptionMenu = ({onSignOut}) => {
  // Add your option menu icon or text here
  return (
    <View>
    <TouchableOpacity style={styles.optionMenu} onPress={onSignOut}>
      <Text>SignOut</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  optionMenu: {
    marginRight: 30,
  },
});

export default OptionMenu;
