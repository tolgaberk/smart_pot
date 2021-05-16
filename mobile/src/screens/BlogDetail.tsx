import React, { FC, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import Api from '../Api';
import { Header } from '../components/Header';
import colors from '../config/colors';
import { dimensions } from '../config/dimensions';
import generalStyles from '../config/generalStyles';

interface BlogDetailProps {
  route: { params: { id: number } };
}

const BlogDetail: FC<BlogDetailProps> = ({ route }) => {
  const [blog, setBlog] = useState<IBlog>();
  const getter = useCallback(
    async () =>
      Api.feathers.service('blogs').get(route.params.id).then(setBlog),
    [route.params.id],
  );

  useEffect(() => {
    getter();
  }, [getter]);

  if (blog) {
    const { text, title } = blog;
    let image = '';
    if (blog?.images[0]) {
      image = blog.images[0].path;
    }
    return (
      <SafeAreaView style={generalStyles.flex}>
        <Header title="Blog Yazısı" leftIsBack />
        <ScrollView
          style={generalStyles.flex}
          contentContainerStyle={styles.container}>
          <FastImage source={{ uri: Api.url + image }} style={styles.image} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  image: { width: (dimensions.width * 9) / 10, height: 300, borderRadius: 8 },
  container: { alignItems: 'center', paddingHorizontal: 16, paddingBottom: 36 },
  title: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
  },
  text: {},
});
export default BlogDetail;
