import React, { FC, useState } from 'react';
import { View, Text, DevSettings } from 'react-native';
import { MediaStream, RTCView } from 'react-native-webrtc';
import Api from '../Api';
import Button from '../components/Button';
import generalStyles from '../config/generalStyles';

interface MyPotProps {}

const MyPot: FC<MyPotProps> = () => {
  const [stream, setStream] = useState<MediaStream>();
  return (
    <View style={generalStyles.flex}>
      <Text>Home</Text>
      <View style={generalStyles.flex}>
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
            style={generalStyles.flex}
          />
        ) : null}
      </View>
    </View>
  );
};

export default MyPot;
