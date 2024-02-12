import {Text, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
//import {Text, FlatList} from 'react-native';
import {SectionList} from 'react-native';

import ListItemsForShare from '../SharedItemCard';
import {useEffect} from 'react';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase/config';
import { getDatabase,onValue,ref } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addSharedItem } from '../Action/action';
export const SharedList = () => {
  const rootstate = useSelector(state => state);
  const sharedList = rootstate?.sharedList;
  const dispatch = useDispatch();
  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(user => JSON.parse(user))
      .then(res => {
        const firebaseApp = initializeApp(firebaseConfig);
        const db = getDatabase();
        
        const reference = ref(db, `/userData/${res?.username}`);
        console.log('res',reference);
        onValue(reference, snapshot => {
          const data = snapshot.val();
          console.log('data for the sharted list',data);
         dispatch(addSharedItem(data?.sharedList?.dataItems));
        });

      });
  }, [dispatch]);
  return sharedList.length > 0 ? (
    <FlatList
      data={sharedList}
      renderItem={item => (
        <ListItemsForShare item={item.item} index={item.index} />
      )}
      keyExtractor={item => item.index}
    />
  ) : (
    <Text>Data is not there </Text>
  );
};
