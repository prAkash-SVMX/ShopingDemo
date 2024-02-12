import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {deleteItem} from './Action/action';
import {getDatabase, ref, set, onValue, remove, push} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ListItemsForShare = ({item, index}) => {
  const [user, setUser] = useState();
  const [isPending, setIsPending] = useState(item.pending);
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const state = useSelector(state => state);
  const dispatch = useDispatch();
    const onDelete = () => {
      // Delete item from personal list
      const personalListRef = ref(
        getDatabase(),
        `/userData/${user?.username}/sharedList/${index}`,
      );
      remove(personalListRef);
    
      // Delete item from shared user's list
      const sharedUserListRef = ref(
        getDatabase(),
        `/userData/${item?.sharedwith}/sharedList/${index}`,
      );
      remove(sharedUserListRef);
    
      // Dispatch action to delete item from Redux state
      dispatch(deleteItem(index));
    };

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(res => JSON.parse(res))
      .then(user => {
        setUser(user);
      });
  }, []);

  const toggleStatus = () => {
    const updatedItem = {
      ...state.shopingList[index],
      bought: !isPending,
      pending: isPending,
    };
    setIsPending(!isPending);
    updateItemInFirebase(updatedItem);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
    updateItemInFirebase({...item, quantity: quantity + 1});
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      updateItemInFirebase({...item, quantity: quantity - 1});
    }
  };
  const updateItemInFirebase = updatedItem => {
    const savedusername = user?.username;
    console.log('item', item);
    const db = getDatabase();
    const personalListRef = ref(
      db,
      `/userData/${savedusername}/sharedList/${index}`,
    );
    const sharedUserListRef = ref(
      db,
      `/userData/${item?.sharedwith}/sharedList/${index}`,
    );
    set(sharedUserListRef, updatedItem);
    set(personalListRef, updatedItem);
  };
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => console.log('Item clicked')}>
      <Image source={{uri: item.thumbnail}} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={decrementQuantity}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={incrementQuantity}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.flagButton,
            {backgroundColor: !isPending ? '#00FF00' : '#FFD700'},
          ]}
          onPress={toggleStatus}>
          <Text style={styles.buttonText}>
            {!isPending ? 'Bought' : 'Pending'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item)}>
          <Text style={styles.buttonText}>Delete</Text>
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
