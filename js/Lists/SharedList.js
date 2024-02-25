import React, { useEffect, useState } from 'react';
import { Text, FlatList, ActivityIndicator } from 'react-native';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase/config';
import { getDatabase, onValue, ref } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addSharedItem } from '../Action/action';
import ListItemsForShare from '../SharedItemCard';
import NoDataScreen from './NoDataScreen'; // Import the NoDataScreen component

export const SharedList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sharedList, setSharedList] = useState([]); // Default value set to an empty array
  const [refresh, setRefresh] = useState(false);
  const fetchData = () => {};

  useEffect(() => {
    // fetchData(); // Fetch data initially when the component mounts
    AsyncStorage.getItem('user')
      .then(user => JSON.parse(user))
      .then(res => {
        const firebaseApp = initializeApp(firebaseConfig);
        const db = getDatabase();

        const reference = ref(
          db,
          `/userData/${res?.username}/sharedList/dataItems`,
        );

        onValue(
          reference,
          snapshot => {
            const data = snapshot.val() || []; // If data is null, set it to an empty array
            setSharedList(data);
            console.log('data for the shared list', data);
            setRefresh(prev => !prev);
            setIsLoading(false);
          },
        );
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return sharedList.length > 0 ? (
    <FlatList
      data={sharedList}
      renderItem={({ item, index }) => (
        <ListItemsForShare item={item} index={index} />
      )}
      keyExtractor={(item, index) => index.toString()}
      key={refresh ? 'refreshKey' : 'normalKey'}
    />
  ) : (
    <NoDataScreen />
  );
};
