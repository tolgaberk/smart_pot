import { ReducerState, ReducerType } from './types';

const initialState: ReducerState = {
  id: undefined,
  email: undefined,
  isLoggedIn: false,
  password: undefined,
  token: undefined,
};
const authReducer: ReducerType = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      state.isLoggedIn = true;
      state.token = action.payload?.token;
      state.email = action.payload?.email;
      state.id = action.payload?.id;
      state.password = undefined;
      break;
    case 'AUTH_FAILED':
      return { ...initialState };
    case 'AUTH_RESET':
      return { ...initialState };
    case 'AUTH':
      state.email = action.payload?.email;
      state.password = action.payload?.password;
      break;
    default:
      return state;
  }
  return { ...state };
};
export default authReducer;
