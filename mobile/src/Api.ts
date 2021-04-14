import feathers, { Service } from '@feathersjs/feathers';
import axios from 'axios';
import {
  EventOnAddStream,
  MediaStream,
  RTCIceCandidate,
  RTCIceCandidateType,
  RTCPeerConnection,
  RTCPeerConnectionConfiguration,
  RTCSessionDescription,
} from 'react-native-webrtc';
import io from 'socket.io-client';
import authentication from '@feathersjs/authentication-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketio from '@feathersjs/socketio-client';
import { Alert } from 'react-native';
export class ApiClass {
  url = 'https://smartpot.online';
  axios = axios;
  socket!: SocketIOClient.Socket;
  peer!: RTCPeerConnection;
  stream!: MediaStream;
  feathers: feathers.Application<{
    pot_data: Service<IPotData>;
    pots: Service<IPot>;
    users: Service<IUser>;
  }>;

  getStreams() {
    console.log(this.peer);
    const streams = this.peer.getRemoteStreams();
    return streams;
  }
  constructor() {
    this.axios.defaults.baseURL = this.url;

    this.socket = io(this.url, { transports: ['websocket'], forceNew: true });

    this.socket.on('connect', () => {
      console.log('connected');
    });

    this.socket.on('error', (error: any) => {
      Alert.alert('Hata', 'Bir hata oluştu daha sonra tekrar deneyiniz');
      console.log(error);
    });

    this.feathers = feathers();
    this.feathers.configure(socketio(this.socket));

    this.feathers.configure(
      authentication({
        storage: AsyncStorage,
      }),
    );
  }

  initRTC(cb: (stream: MediaStream) => void) {
    const config: RTCPeerConnectionConfiguration = {
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    };

    this.socket.on('offer', (id: any, description: RTCSessionDescription) => {
      this.peer = new RTCPeerConnection(config);
      this.peer
        .setRemoteDescription(description)
        .then(() => this.peer.createAnswer())
        .then((sdp) => this.peer.setLocalDescription(sdp))
        .then(() => {
          this.socket.emit('answer', id, this.peer.localDescription);
        });

      this.peer.onaddstream = (event: EventOnAddStream) => {
        this.stream = event.stream;
        cb(this.stream);
        console.log('stream registered', event.stream.id);
      };
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('candidate', id, event.candidate);
        }
      };
    });

    this.socket.on('candidate', (id: any, candidate: RTCIceCandidateType) => {
      this.peer
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });
    this.socket.on('broadcaster', () => {
      this.socket.emit('watcher');
    });

    this.socket.emit('watcher');
  }
  closeRTC() {
    console.log('asdasd');
    this.socket.emit('disconnectFromBroadcaster');
    (this.stream as any) = null;
    (this.peer as any) = null;
    this.socket.removeListener('offer');
    this.socket.removeListener('candidate');
    this.socket.removeListener('broadcaster');
  }

  async login() {}
}

export default new ApiClass();
