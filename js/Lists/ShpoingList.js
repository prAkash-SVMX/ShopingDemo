import {Text, FlatList} from 'react-native';

import SharedList from './SharedList';
//import {Text, FlatList} from 'react-native';
import {SectionList} from 'react-native';
import {useEffect} from 'react';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '../firebase/config';
import {getDatabase, onValue, ref} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addShopingList} from '../Action/action';
import ListItems from '../ListItem';
import {useSelector, useDispatch} from 'react-redux';
export const ShopingList = () => {
  const rootstate = useSelector(state => state);
  const dispatch = useDispatch();
  const shopinglistdata = rootstate?.shopingList || [];
  console.log('rootsatet for list view', rootstate);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(user => JSON.parse(user))
      .then(res => {
        const firebaseApp = initializeApp(firebaseConfig);
        const db = getDatabase();

        const reference = ref(db, `/userData/${res?.username}`);
        console.log('res', reference);
        onValue(reference, snapshot => {
          const data = snapshot.val();
          console.log('data for the sharted list', data);

          dispatch(addShopingList(data.shopingList));
        });
      });
  }, [dispatch]);
  return shopinglistdata.length > 0 ? (
    <FlatList
      data={shopinglistdata}
      renderItem={item => <ListItems item={item.item} index={item.index} />}
    />
  ) : (
    <Text>Data is not there </Text>
  );
};
