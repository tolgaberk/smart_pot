import { DrawerActions, useNavigation } from '@react-navigation/core';
import React, { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Back, BurgerMenu } from '../assets/icons';
import colors from '../config/colors';
import { pressableStyle } from '../helpers/pressableStyle';

export const Header: FC<{
  title: string;
  leftIsBack?: boolean;
  Right?: () => JSX.Element;
}> = ({ leftIsBack, title, Right }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <View style={styles.left}>
        <Pressable
          hitSlop={24}
          android_ripple={{ color: colors.primary, radius: 20 }}
          style={pressableStyle({
            alignItems: 'center',
            justifyContent: 'center',
          })}
          onPress={() =>
            leftIsBack
              ? navigation.goBack()
              : navigation.dispatch(DrawerActions.toggleDrawer())
          }>
          {leftIsBack ? (
            <Back color={colors.black} />
          ) : (
            <BurgerMenu color={colors.black} />
          )}
        </Pressable>
      </View>
      <View style={styles.center}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.right}>{Right && <Right />}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexGrow: 1,
  },
  right: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  center: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: '600',
    color: colors.primary,
    fontSize: 32,
    textAlignVertical: 'center',
  },
  headerContainer: {
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -80,
    paddingTop: 80,
    height: 140,
  },
});
