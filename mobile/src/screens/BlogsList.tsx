import { Paginated } from '@feathersjs/feathers';
import { useNavigation } from '@react-navigation/core';
import React, { FC, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Api from '../Api';
import { Text } from '../components';
import { Header } from '../components/Header';
import colors from '../config/colors';
import { dimensions } from '../config/dimensions';
import generalStyles from '../config/generalStyles';
import { pressableStyle } from '../helpers/pressableStyle';

interface BlogProps {}

const Blog: FC<BlogProps> = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const getter = async () => {
    const res = (await Api.feathers
      .service('blogs')
      .find()) as Paginated<IBlog>;
    setBlogs(res.data);
    setLoading(false);
  };
  useEffect(() => {
    getter();
  }, []);
  const reload = () => {
    setLoading(true);
    getter();
  };

  return (
    <SafeAreaView style={generalStyles.flex}>
      <Header title="Blog Yazıları" />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={reload} />
        }
        data={blogs}
        style={generalStyles.flex}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BlogCard blog={item} />}
      />
    </SafeAreaView>
  );
};

interface BlogCardProps {
  blog: IBlog;
}

const BlogCard: FC<BlogCardProps> = ({ blog }) => {
  const {
    id,
    images: [image],
    text,
    title,
  } = blog;

  //

  const navigation = useNavigation();
  const onCardPress = () => {
    navigation.navigate('BlogDetail', { id });
  };

  return (
    <Pressable style={pressableStyle(styles.card)} onPress={onCardPress}>
      <FastImage style={styles.image} source={{ uri: Api.url + image.path }} />
      <Text text={title} style={styles.title} />
      <Text numberOfLines={2} text={text} style={styles.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 16,
    borderRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginVertical: 16,
  },
  image: {
    width: (dimensions.width * 8) / 10,
    height: 200,
    borderRadius: 8,
  },
  text: {},
});
export default Blog;
