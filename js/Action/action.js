import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT_SUCCESS,
  ADD_ITEM,
  ADD_USER,
  ADD_SHOPING_LIST,
  DELETE_ITEM_FROM_SHOPING_LIST,
  ADD_SHARED_ITEM,
  DELETE_SHARED_ITEM,
} from './type';

export const loginSuccess = user => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const addShopingList = shoinglist => ({
  type: ADD_SHOPING_LIST,
  payload: shoinglist,
});

export const AddUserData = user => ({
  type: ADD_USER,
  payload: user,
});

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const signupSuccess = user => ({
  type: SIGNUP_SUCCESS,
  payload: user,
});

export const signupFailure = error => ({
  type: SIGNUP_FAILURE,
  payload: error,
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

export const addItem = item => ({
  type: ADD_ITEM,
  payload: item,
});

export const deleteItem = index => {
  return {
    type: DELETE_ITEM_FROM_SHOPING_LIST,
    payload: index,
  };
};

export const deleteSharedItem = index => {
  return {
    type: DELETE_SHARED_ITEM,
    payload: index,
  };
};

export const addSharedItem = item => {
  return {
    type: ADD_SHARED_ITEM,
    payload: item,
  };
};
