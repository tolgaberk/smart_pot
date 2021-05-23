import {
  EventOnAddStream,
  MediaStream,
  RTCIceCandidate,
  RTCIceCandidateType,
  RTCPeerConnection,
  RTCPeerConnectionConfiguration,
  RTCSessionDescriptionType,
} from 'react-native-webrtc';

export class RTCSocket {
  config: RTCPeerConnectionConfiguration = {
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
  peer: RTCPeerConnection;

  constructor(
    private gotStream: (stream: MediaStream) => void,
    private socket: SocketIOClient.Socket,
    private potMAC: string,
  ) {
    this.peer = new RTCPeerConnection(this.config);
    this.peer.onaddstream = this.onAddStream.bind(this);
    this.socket.on('offer', this.onOffer.bind(this));
    this.socket.on('candidate', this.onCandidate.bind(this));
    this.openSocket();
  }
  private onOffer(socketId: string, description: RTCSessionDescriptionType) {
    this.setRemoteDescription(socketId, description);
  }
  private async onCandidate(
    _socketId: string,
    description: RTCIceCandidateType,
  ) {
    try {
      await this.peer.addIceCandidate(new RTCIceCandidate(description));
    } catch (err) {
      console.error(err);
    }
  }

  private onAddStream(event: EventOnAddStream) {
    this.gotStream(event.stream);
  }
  private async setRemoteDescription(
    socketId: string,
    description: RTCSessionDescriptionType,
  ) {
    await this.peer.setRemoteDescription(description);
    const sdp = await this.peer.createAnswer();
    await this.peer.setLocalDescription(sdp);
    this.socket.emit('answer', socketId, this.peer.localDescription);
  }

  openSocket() {
    console.log('Opening WebRTC Socket');
    this.socket.emit('watcher', this.potMAC);
  }
  closeSocket() {
    console.log('Closing WebRTC Socket');
    this.socket.emit('disconnectFromBroadcaster', this.potMAC);
    this.socket.removeListener('offer');
    this.socket.removeListener('candidate');
    this.socket.removeListener('broadcaster');
    (this.peer as any) = null;
  }
}
