import {Text,FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import SharedList from './SharedList';
//import {Text, FlatList} from 'react-native';
import {SectionList} from 'react-native';

import ListItems from '../ListItem';

export const ShopingList = () => {
  const rootstate = useSelector(state => state);
  const shopinglistdata = rootstate?.shopingList ||[];
  console.log('rootsatet for list view', rootstate);

  return shopinglistdata.length > 0 ? (
    <FlatList
      data={shopinglistdata}
      renderItem={item => <ListItems item={item.item} index={item.index} />}
    />
  ) : (
    <Text>Data is not there </Text>
  );
};
