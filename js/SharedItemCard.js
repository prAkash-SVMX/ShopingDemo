import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {deleteItem} from './Action/action';
import {getDatabase, ref, set, remove} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItemsForShare = ({item, index}) => {
  const [user, setUser] = useState();
  const [isPending, setIsPending] = useState(item?.pending);
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isBought, setBought] = useState(item.bought || false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingToggleStatus, setLoadingToggleStatus] = useState(false);
  const [loadingIncrement, setLoadingIncrement] = useState(false);
  const [loadingDecrement, setLoadingDecrement] = useState(false);

  const onDelete = async () => {
    try {
      setLoadingDelete(true); // Start loading indicator

      const personalListRef = ref(
        getDatabase(),
        `/userData/${item?.saharedby}/sharedList/dataItems/${index}`,
      );

      const sharedUserListRef = ref(
        getDatabase(),
        `/userData/${item?.sharedwith}/sharedList/dataItems/${index}`,
      );

      await Promise.all([remove(personalListRef), remove(sharedUserListRef)]);
      dispatch(deleteItem(index));

      setLoadingDelete(false); // Stop loading indicator
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(error);
      setLoadingDelete(false); // Stop loading indicator in case of error
    }
  };

  useEffect(() => {
    try {
      AsyncStorage.getItem('user')
        .then(res => JSON.parse(res))
        .then(user => {
          setUser(user);
          console.log('user details for shared item', user);
        });
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error);
    }
  }, []);

  const toggleStatus = () => {
    try {
      setLoadingToggleStatus(true); // Start loading indicator

      const updatedItem = {
        ...state.shopingList[index],
        bought: !isPending,
        pending: isPending,
      };
      setIsPending(!isPending);
      setBought(!isBought);
      console.log('shared item from stae', JSON.stringify(item));
      updateItemInFirebase({...item, bought: !isBought});

      setLoadingToggleStatus(false); // Stop loading indicator
    } catch (error) {
      console.error('Error toggling status:', error);
      setError(error);
      setLoadingToggleStatus(false); // Stop loading indicator in case of error
    }
  };

  const incrementQuantity = () => {
    try {
      setLoadingIncrement(true); // Start loading indicator

      setQuantity(quantity + 1);
      updateItemInFirebase({...item, quantity: quantity + 1});

      setLoadingIncrement(false); // Stop loading indicator
    } catch (error) {
      console.error('Error incrementing quantity:', error);
      setError(error);
      setLoadingIncrement(false); // Stop loading indicator in case of error
    }
  };

  const decrementQuantity = () => {
    try {
      setLoadingDecrement(true); // Start loading indicator

      if (quantity > 1) {
        setQuantity(quantity - 1);
        updateItemInFirebase({...item, quantity: quantity - 1});
      }

      setLoadingDecrement(false); // Stop loading indicator
    } catch (error) {
      console.error('Error decrementing quantity:', error);
      setError(error);
      setLoadingDecrement(false); // Stop loading indicator in case of error
    }
  };

  const updateItemInFirebase = async updatedItem => {
    try {
      const savedusername = user?.username;
      const db = getDatabase();
      const personalListRef = ref(
        db,
        `/userData/${item?.saharedby}/sharedList/dataItems/${index}`,
      );
      const sharedUserListRef = ref(
        db,
        `/userData/${item?.sharedwith}/sharedList/dataItems/${index}`,
      );
      console.log('personalListRef', personalListRef);
      console.log('shared', sharedUserListRef);

      await Promise.all([
        set(sharedUserListRef, updatedItem),
        set(personalListRef, updatedItem),
      ]);
    } catch (error) {
      console.error('Error updating item in Firebase:', error);
      setError(error);
    }
  };

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => console.log('Item clicked')}>
      {item && item.thumbnail && (
        <Image source={{uri: item.thumbnail}} style={styles.image} />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item && item.title}</Text>
        <Text style={styles.price}>${item && item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={decrementQuantity}>
            {loadingDecrement ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>-</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={incrementQuantity}>
            {loadingIncrement ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>+</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.flagButton,
            {backgroundColor: isBought ? '#00FF00' : '#FFD700'},
          ]}
          onPress={toggleStatus}>
          {loadingToggleStatus ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isBought ? 'Bought' : 'Pending'}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item)}>
          {loadingDelete ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginRight: 5,
  },
  quantityButton: {
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
  },
  flagButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#007bff', // Change color if needed
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FF5733',
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ListItemsForShare;
