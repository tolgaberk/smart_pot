import { useIsFocused } from '@react-navigation/core';
import React, { FC, useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import Api from '../Api';
import Field from '../components/Field';
import useReduxSelector from '../hooks/useReduxSelector';

interface MyMembershipProps {}

const MyMembership: FC<MyMembershipProps> = () => {
  const user = useReduxSelector(({ authState }) => authState);
  const getter = useCallback(async () => {
    if (user.id) {
      try {
        const dbuser = await Api.feathers.service('users').get(user.id);
        console.log(dbuser);
      } catch (err) {
        if (err.code === 401) {
          await Api.feathers.reAuthenticate();
          getter();
        }
      }
    }
  }, [user.id]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getter();
    }
  }, [getter, isFocused]);
  return (
    <View>
      <Text>Ad Soyad</Text>
      <Field value={user.email} />
      <Text>MyMembership</Text>
    </View>
  );
};

export default MyMembership;
