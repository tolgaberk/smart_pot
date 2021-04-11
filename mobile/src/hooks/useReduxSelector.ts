import { shallowEqual, useSelector } from 'react-redux';
import { AllReduxState } from '../redux/ReduxTypes';

export default function useReduxSelector<U, T = AllReduxState>(
  fn: (state: T) => U,
) {
  return useSelector<T, U>(fn, shallowEqual);
}
