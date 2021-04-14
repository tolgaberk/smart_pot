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
  }

  initRTC(cb: (stream: MediaStream) => void) {
    this.socket.on('offer', this.onOffer(cb).bind(this));
    this.socket.on('candidate', this.onCandidate.bind(this));
    this.socket.emit('watcher');
  }
  closeRTC() {
    console.log('DISCONNECT FROM PEER');
    this.socket.emit('disconnect');
  }

  private onOffer = (cb: (stream: MediaStream) => void) => (
    id: any,
    description: RTCSessionDescription,
  ) => {
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
  };

  // private onAddStream =
  // private onIceCandidate =

  private onCandidate = (id: any, candidate: RTCIceCandidateType) => {
    this.peer
      .addIceCandidate(new RTCIceCandidate(candidate))
      .catch((e) => console.error(e));
  };

  // private onConnect =

  // private onBroadCaster =

  async login() {}
}

export default new ApiClass();
