import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {ShopingList} from './ShpoingList';
import {SharedList} from './SharedList';

const Screen1 = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Screen 1</Text>
  </View>
);

const Screen2 = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Screen 2</Text>
  </View>
);

const ListView = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = tabNumber => {
    setActiveTab(tabNumber);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.activeTabButton]}
          onPress={() => handleTabChange(1)}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 1 && styles.activeTabButtonText,
            ]}>
            ShopingList
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 2 && styles.activeTabButton]}
          onPress={() => handleTabChange(2)}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 2 && styles.activeTabButtonText,
            ]}>
            SharedList
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.screenContainer}>
        {activeTab === 1 && (
          <View style={styles.screenContent}>
            <ShopingList />
          </View>
        )}
        {activeTab === 2 && (
          <View style={styles.screenContent}>
            <SharedList />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  activeTabButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
  screenText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ListView;
