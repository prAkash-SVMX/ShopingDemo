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
  const [quantity, setQuantity] = useState(item.quantity || 1);
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
    var emaildata = {};
    let shareWith;
    if (sharingOption === 'email') {
      const replacedStr = sharingusername.replace(/\./g, '^');
      let db = getDatabase();
      const emailref = ref(db, '/userByMail');

      onValue(
        emailref,
        snapshot => {
          const data = snapshot.val();
          console.log('repla', replacedStr);
          console.log('userdata', JSON.stringify(data));
          emaildata = data[replacedStr];

          // Perform any further processing here with emaildata
          // For example, if (emaildata) { shareWith = emaildata; }
          // Ensure that all necessary operations involving emaildata are within this block

          console.log('sharing username', emaildata);
        },
        error => {
          console.error('Error fetching email data:', error);
        },
      );
    }
    shareWith =
      emaildata && sharingOption === 'email' ? emaildata : sharingusername;
    const savedusername = user?.username;
    let personalData;
    let userexist;
    let sharedUserData;
    let db = getDatabase();
    const sharedListRef = ref(db, `/userData/${shareWith}`);
    if (sharingusername) {
      onValue(sharedListRef, snapshot => {
        sharedUserData = snapshot.val();
        console.log('hiii', sharedUserData);
        if (sharedUserData) {
          userexist = true;
          console.log(userexist);
        } else {
          userexist = false;
          console.log(
            'User being shared with does not exist in Firebase data.',
          );
        }
      });
    }
    const listItemObject = {
      ...state.shopingList[index],
      quanity: quantity,
      bought: !isPending,
      pending: isPending,
      saharedby: savedusername,
      sharedwith: shareWith,
    };
    if (userexist) {
      const sharedList = sharedUserData?.sharedList?.dataItems || [];
      const sharedListRef1 = ref(db, `/userData/${shareWith}/sharedList`);
      sharedList.push(listItemObject);
      set(sharedListRef, {
        ...sharedUserData,
        sharedList: {
          dataItems: sharedList,
        },
      })
        .then(() => {
          dispatch(addSharedItem(sharedList));
        })
        .catch(err => console.error('got an error ', err));
    }

    const personalListRef = ref(db, `/userData/${savedusername}`);
    onValue(personalListRef, snapshot => {
      const userData = snapshot.val();
      if (userData) {
        // console.log('userData',userData.sharedList.dataItems.push({}));
        const personalList = userData?.sharedList?.dataItems || [];
        personalList.push(listItemObject);
        personalData = {
          ...userData,
          sharedList: {
            dataItems: [...personalList],
          },
        };
        dispatch(addSharedItem(personalList));
      } else {
        console.log('User does not exist in Firebase data.');
      }
    });
    set(personalListRef, personalData);
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
