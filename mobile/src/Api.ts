import feathers, { Service } from '@feathersjs/feathers';
import axios from 'axios';
import { MediaStream } from 'react-native-webrtc';
import io from 'socket.io-client';
import authentication from '@feathersjs/authentication-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketio from '@feathersjs/socketio-client';
import { Alert } from 'react-native';
import { RTCSocket } from './RTCSocket';
export class ApiClass {
  url = 'https://smartpot.online';
  axios = axios;
  socket!: SocketIOClient.Socket;
  stream!: MediaStream;

  RTCSocket?: RTCSocket;
  feathers!: feathers.Application<{
    pot_data: Service<IPotData>;
    pots: Service<IPot>;
    users: Service<IUser>;
    flowers: Service<IFlower>;
    blogs: Service<IBlog>;
  }>;

  getStreams() {
    console.log(this.RTCSocket);
    const streams = this.RTCSocket?.peer.getRemoteStreams();
    return streams;
  }
  init() {
    this.axios.defaults.baseURL = this.url;
    this.configureSocket();
    this.configureFeathers();
  }

  configureSocket() {
    this.socket = io(this.url, { transports: ['websocket'], forceNew: true });
    this.socket.on('connect', this.onSocketConnect.bind(this));
    this.socket.on('error', this.onSocketError.bind(this));
  }
  configureFeathers() {
    this.feathers = feathers();
    this.feathers.configure(socketio(this.socket));

    const auth = authentication({
      storage: AsyncStorage,
    });
    this.feathers.configure(auth);
  }
  onSocketConnect() {
    console.log('SOCKET CONNECTED');
  }
  onSocketError(error: any) {
    Alert.alert('Hata', 'Bir hata oluştu daha sonra tekrar deneyiniz');
    console.log('SOCKET ERROR', error);
  }

  initRTC(cb: (stream: MediaStream) => void, potMAC: string) {
    this.RTCSocket = new RTCSocket(cb, this.socket, potMAC);
  }
  closeRTC() {
    this.RTCSocket?.closeSocket();
    delete this.RTCSocket;
  }
}

export default new ApiClass();
