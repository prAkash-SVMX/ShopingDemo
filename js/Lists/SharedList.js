import {Text, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
//import {Text, FlatList} from 'react-native';
import {SectionList} from 'react-native';

import ListItemsForShare from '../SharedItemCard';

export const SharedList = () => {
  const rootstate = useSelector(state => state);
  const sharedList = rootstate?.sharedList;
  console.log('rootsatet fro list view', sharedList);

  return sharedList.length > 0 ? (
    <FlatList
      data={sharedList}
      renderItem={item => (
        <ListItemsForShare item={item.item} index={item.index} />
      )}
    />
  ) : (
    <Text>Data is not there </Text>
  );
};
