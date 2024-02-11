import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {deleteItem, addSharedItem} from './Action/action';
import {firebaseConfig} from './firebase/config';
import {initializeApp} from 'firebase/app';
import {getDatabase, ref, set, onValue, remove, push} from 'firebase/database';

const ListItems = ({item, index}) => {
  const [isPending, setIsPending] = useState(item.pending);
  const [quantity, setQuantity] = useState(item.quantity || 1); // Default quantity to 1 if not provided
  const state = useSelector(state => state);
  const [showModal, setShowModal] = useState(false);
  const [sharingusername, setUsername] = useState('');
  const [user, setUser] = useState();
  const [sharingOption, setSharingOption] = useState('username');
  const [firebaseUserData, setFirebasebaseData] = useState();
  const dispatch = useDispatch();
  let firebaseApp = initializeApp(firebaseConfig);
  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(res => JSON.parse(res))
      .then(user => {
        setUser(user);
      });
  }, []);
  const onDelete = () => {
    dispatch(deleteItem(index));
    deleteFromFirebase();
  };

  const toggleStatus = () => {
    const updatedItem = {
      ...state.shopingList[index],
      bought: !isPending,
      pending: isPending,
    };
    setIsPending(!isPending); // Toggle the pending status locally
    updateItemInFirebase(updatedItem); // Update the item in Firebase
  };
  const handleShare = () => {
    setShowModal(true);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
    updateItemInFirebase({...item, quantity: quantity + 1});
  };
  const shareItem = () => {
    //
    let userexist = true;
    const listItemObject = {
      ...state.shopingList[index],
      quanity: quantity,
      bought: !isPending,
      pending: isPending,
    };
    const savedusername = user?.username;
    // console.log('indexdata', listItemObject);
    let db = getDatabase();
    const personalListRef = ref(db, `/userData/${savedusername}`);
    let personalData;
    // Check if the user exists in Firebase data
    console.log('indexdata', personalListRef);
    onValue(personalListRef, snapshot => {
      const userData = snapshot.val();
      if (userData) {
        // console.log('userData',userData.sharedList.dataItems.push({}));
        const personalList = userData?.sharedList?.dataItems || [];
        personalList.push(listItemObject);
        console.log('indexdata', personalList);
        personalData = {
          ...userData,
          sharedList: {
            dataItems: [...personalList],
            saharedby: savedusername,
            sharedwith: sharingusername,
          },
        };
        dispatch(addSharedItem(personalList));
      } else {
        // If user does not exist, show error or handle accordingly
        console.log('User does not exist in Firebase data.');
        // You can display an error message or handle the situation as needed
      }
    });

    let sharedData;
    // Check if the user is sharing the item with someone
    if (sharingusername) {
      const sharedListRef = ref(db, `/userData/${sharingusername}`);
      console.log('ref', sharedListRef);
      //Check if the user being shared with exists in Firebase data
      onValue(sharedListRef, snapshot => {
        const sharedUserData = snapshot.val();
        console.log('hiii', sharedUserData);
        if (sharedUserData) {
          // If user exists, add item to their shared list

          const sharedList = sharedUserData?.sharedList || [];
          sharedList.push(listItemObject);
          console.log('sharedList', sharedList);
          sharedData = {
            ...sharedUserData,
            sharedList: {
              dataItems: [...sharedList],
              saharedby: savedusername,
              sharedwith: sharingusername,
            },
          };
          // Optionally dispatch an action to update Redux state for shared list
        } else {
          userexist = false;
          // If user does not exist, show error or handle accordingly
          console.log(
            'User being shared with does not exist in Firebase data.',
          );
          // You can display an error message or handle the situation as needed
        }
      });

      set(sharedListRef, sharedData)
        .then(() => {
          console.log('shared');
        })
        .catch(err => console.error('got an error ', err));
    }
    setShowModal(false);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      updateItemInFirebase({...item, quantity: quantity - 1});
    }
  };

  const updateItemInFirebase = updatedItem => {
    const savedusername = user?.username;
    const db = getDatabase();
    const personalListRef = ref(
      db,
      `/userData/${savedusername}/shopingList/${index}`,
    );
    set(personalListRef, updatedItem);
  };

  const deleteFromFirebase = () => {
    const savedusername = user?.username;
    const db = getDatabase();
    const personalListRef = ref(
      db,
      `/userData/${savedusername}/shopingList/${index}`,
    );
    remove(personalListRef);
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

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Share Item</Text>
              <TextInput
                style={styles.input}
                value={sharingusername}
                autoCapitalize={false}
                onChangeText={text => setUsername(text)}
                placeholder="Enter email or username"
              />
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    sharingOption === 'email' && styles.radioButtonSelected,
                  ]}
                  onPress={() => setSharingOption('email')}>
                  <Text>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    sharingOption === 'username' && styles.radioButtonSelected,
                  ]}
                  onPress={() => setSharingOption('username')}>
                  <Text>Username</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowModal(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.shareButtonModal]}
                  onPress={shareItem}>
                  <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    justifyContent: 'space-between',
  },
  flagButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  shareButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#007bff', // Example share button color
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF5733',
  },
  shareButtonModal: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FF5733',
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5733',
    borderRadius: 5,
    paddingVertical: 10,
    marginRight: 10,
  },
  shareButtonModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButtonModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5733',
    borderRadius: 5,
    paddingVertical: 10,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default ListItems;
