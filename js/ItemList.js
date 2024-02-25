import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import {AddUserData, addShopingList} from './Action/action';
import {useDispatch, useSelector} from 'react-redux';
import {firebaseConfig} from './firebase/config';
import {initializeApp} from 'firebase/app';
import {getDatabase, ref, set, onValue} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ShoppingCard = ({item, index, id}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const rootstate = useSelector(state => state);
  const [firebaseUserData, setFirebasebaseData] = useState();
  const dispatch = useDispatch();
  const handleAddToList = () => {
    setModalVisible(true);
  };

  let firebaseApp = initializeApp(firebaseConfig);

  const [user, setUser] = useState();
  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(res => JSON.parse(res))
      .then(user => {
        setUser(user);
      });
  }, []);

  const handleAddToPersonalList = indexdata => {
    console.log('indexdata', id);
    const newarray = [...rootstate.shopingList];
    AsyncStorage.getItem('user')
      .then(res => JSON.parse(res))
      .then(user => {
        setUser(user);
      });
    const listItemObject = {
      ...rootstate.items[index],
      quantity: 1,
      bought: false,
      pending: true,
    };

    const usernamedata = user?.username;
    let db = getDatabase();
    const refrence = ref(db, `/userData/${usernamedata}`);
    let firebaseuser;
    console.log('ref', refrence);
    onValue(refrence, snapshot => {
      const data = snapshot.val();
      firebaseuser = data;
      console.log('firebase user data', data);
      dispatch(AddUserData(data));
      setFirebasebaseData(data);
    });
    console.log('firebaseuserdata', firebaseuser);
    newarray.push(listItemObject);
    set(refrence, {
      ...firebaseuser,
      shopingList: newarray,
    });
    dispatch(addShopingList(newarray));
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.card}
        onPress={() => console.log('Item clicked')}>
        <Image source={{uri: item.thumbnail}} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddToList}>
          <Text style={styles.buttonText}>Add to List</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={index => {
                handleAddToPersonalList(index);
              }}>
              <Text>Add to Shoping List</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.modalOption}
              disabled={true}
              onPress={handleAddToSharedList}>
              <Text>Add to Shared List</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  button: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    marginBottom: 20,
  },
  closeText: {
    marginTop: 20,
    color: '#888',
    textAlign: 'center',
  },
});

export default ShoppingCard;