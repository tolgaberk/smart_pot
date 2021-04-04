import React, { FC, useState } from 'react';
import { DevSettings, Text, View } from 'react-native';
import Api from '../Api';
import { RTCView, MediaStream } from 'react-native-webrtc';
import Button from '../components/Button';
import styles from '../config/styles';

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  const [stream, setStream] = useState<MediaStream>();
  return (
    <View style={styles.flex}>
      <Text>Home</Text>
      <View style={styles.flex}>
        <Button text="Reload" onPress={() => DevSettings.reload()} />
        <Button
          text="Init RTC"
          onPress={() => {
            Api.initRTC((newStream) => setStream((_) => newStream));
          }}
        />
        {stream ? (
          <RTCView
            streamURL={stream.toURL()}
            objectFit="contain"
            style={styles.flex}
          />
        ) : null}
      </View>
    </View>
  );
};

export default Home;
