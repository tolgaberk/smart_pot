import { Actions as AuthActions } from './auth/types';

type AllReduxState = ReturnType<typeof import('./configureStore').rootReducer>;

type AllActions = AuthActions;

type OptionalSpread<T> = T extends undefined ? [] : [T];
export type ActionCreator<T = undefined> = (
  ...args: OptionalSpread<T>
) => (
  dp: React.Dispatch<AllActions>,
  st?: AllReduxState,
) => AllActions | Promise<AllActions | void> | void;
