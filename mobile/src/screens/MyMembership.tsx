import { Paginated } from '@feathersjs/feathers';
import { useIsFocused } from '@react-navigation/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Api from '../Api';
import { Text } from '../components';
import { Header } from '../components/Header';
import colors from '../config/colors';
import generalStyles from '../config/generalStyles';
import useReduxSelector from '../hooks/useReduxSelector';

interface MyMembershipProps {}

const MyMembership: FC<MyMembershipProps> = () => {
  const user = useReduxSelector(({ authState }) => authState);
  const [potCount, setPotCount] = useState(0);
  const getter = useCallback(async () => {
    if (user.id) {
      try {
        const potCountRes = (((await Api.feathers
          .service('pots')
          .find({ query: { user_id: user.id } })) as unknown) as Paginated<
          IPot[]
        >).total;
        setPotCount(potCountRes);
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
    <SafeAreaView style={generalStyles.flex}>
      <Header leftIsBack title="Hesabım" />
      <View style={styles.screenContainer}>
        <Field title="E-Mail" text={user.email} />
        <Field title="Saksı Sayısı" text={potCount} />
      </View>
    </SafeAreaView>
  );
};

export default MyMembership;

function Field({ title, text }: { title: string; text?: string | number }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldTitle}>{title}</Text>
      <View style={styles.fieldTextContainer}>
        <Text style={styles.fieldText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldText: { fontSize: 18, opacity: 0.6 },
  fieldTextContainer: {
    backgroundColor: colors.card,
    padding: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  fieldTitle: { fontSize: 24, color: colors.primary, fontWeight: 'bold' },
  fieldContainer: { marginVertical: 8 },
  screenContainer: { padding: 16 },
});
