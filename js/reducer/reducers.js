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
} from '../Action/type';

const initialState = {
  user: null,
  error: null,
  items: [],
  shopingList: [],
  sharedList: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        error: null,
      };
    case ADD_SHOPING_LIST:
      return {
        ...state,
        shopingList: [...action.payload],
      };
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, ...action.payload],
      };
    case ADD_USER:
      return {
        ...state,
        user: {...state.user, ...action.payload},
      };
    case DELETE_ITEM_FROM_SHOPING_LIST:
      // Create a copy of the shopping list array without the item to be deleted
      const updatedList = state.shopingList.filter(
        (item, index) => index !== action.payload,
      );
      return {
        ...state,
        shopingList: updatedList,
      };
    case DELETE_SHARED_ITEM:
      // Create a copy of the shared list array without the item to be deleted
      const updatedList1 = state.sharedList.filter(
        (item, index) => index !== action.payload,
      );
      return {
        ...state,
        sharedList: updatedList1,
      };
    case ADD_SHARED_ITEM:
      return {
        ...state,
        sharedList: [...state.sharedList, ...action.payload],
      };

    default:
      return state;
  }
};

export default rootReducer;
