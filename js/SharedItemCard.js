import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {deleteItem} from './Action/action';

const ListItemsForShare = ({item, index}) => {
  const [isPending, setIsPending] = useState(item.pending);
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const onDelete = () => {
    dispatch(deleteItem(index));
  };

  const toggleStatus = () => {
    setIsPending(!isPending);
    console.log(index);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
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
