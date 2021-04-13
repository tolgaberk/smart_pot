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
export class ApiClass {
  url = 'http://192.168.1.112:9876';
  axios = axios;
  socket!: SocketIOClient.Socket;
  peer!: RTCPeerConnection;
  stream!: MediaStream;
  feathers: feathers.Application<{
    pot_data: Service<IPotData>;
    pots: Service<IPot>;
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

    this.socket.on('disconnect', () => {
      console.log('disconnected');
    });
    this.socket.on('error', (error: any) => {
      console.log(error);
    });

    this.feathers = feathers();
    this.feathers.configure(socketio(this.socket));

    this.feathers.configure(
      authentication({
        storage: AsyncStorage,
      }),
    );
    // this.feathers.configure(socketio(this.socket));
  }

  initRTC(cb: (stream: MediaStream) => void) {
    let peerConnection: RTCPeerConnection;
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
      peerConnection = new RTCPeerConnection(config);
      this.peer = peerConnection;
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          this.socket.emit('answer', id, peerConnection.localDescription);
        });

      peerConnection.onaddstream = (event: EventOnAddStream) => {
        this.stream = event.stream;
        cb(this.stream);
        console.log('stream registered', event.stream.id);
      };
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('candidate', id, event.candidate);
        }
      };
    });

    this.socket.on('candidate', (id: any, candidate: RTCIceCandidateType) => {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });
    this.socket.on('connect', () => {
      this.socket.emit('watcher');
    });

    this.socket.on('broadcaster', () => {
      this.socket.emit('watcher');
    });
    this.socket.emit('watcher');
  }
  close() {
    this.socket.emit('disconnectPeer');
  }

  async login() {}
}

export default new ApiClass();
