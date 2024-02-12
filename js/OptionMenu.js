import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

const OptionMenu = ({onSignOut}) => {
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
    marginRight: 20,
  },
});

export default OptionMenu;
