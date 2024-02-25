import React, {useEffect, useState} from 'react';
import {Text, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '../firebase/config';
import {getDatabase, onValue, ref} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addShopingList} from '../Action/action';
import ListItems from '../ListItem';
import {useSelector, useDispatch} from 'react-redux';
import NoDataScreen from './NoDataScreen'; // Import the NoDataScreen component

export const ShopingList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const rootstate = useSelector(state => state);
  const dispatch = useDispatch();
  const shopinglistdata = rootstate?.shopingList || [];
  //console.log('rootsatet for list view', rootstate);

  const fetchData = () => {
    AsyncStorage.getItem('user')
      .then(user => JSON.parse(user))
      .then(res => {
        console.log('res', res);
        const firebaseApp = initializeApp(firebaseConfig);
        const db = getDatabase();
        const reference = ref(db, `/userData/${res?.username}/shopingList`);
        console.log('res', reference);
        onValue(reference, snapshot => {
          const data = snapshot.val();
          console.log('data for the shared list', data);
          if (data) {
            dispatch(addShopingList(data));
          } else {
            console.log('Shoping list data is null or undefined');
          }
          setIsLoading(false);
          setIsRefreshing(false);
        });
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        />
      ) : shopinglistdata.length > 0 ? (
        <FlatList
          data={shopinglistdata}
          renderItem={item => <ListItems item={item.item} index={item.index} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      ) : (
        <NoDataScreen /> // Render the NoDataScreen component when there is no data available
      )}
    </>
  );
};
