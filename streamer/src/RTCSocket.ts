import io from "socket.io-client";
export default class RTCSocket {
  peerConnections: Record<any, RTCPeerConnection> = {};
  socket: SocketIOClient.Socket;
  videoStream?: MediaStream;
  config = {
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  };
  constructor(
    private video: HTMLVideoElement,
    private url: string,
    private logger: (str: string) => void
  ) {
    this.socket = io(this.url);
    this.socket.on("connect", this.onConnect.bind(this));
    this.socket.on("error", this.onIOError.bind(this));
  }
  onIOError() {
    window.location.reload();
  }

  //

  async init() {
    this.logger("initializing");
    if (navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.socket.emit("broadcaster", "9C:9C:1F:47:B5:B9");
        this.video.srcObject = stream;
        this.videoStream = stream;
      } catch (err) {
        console.log("Something went wrong!", JSON.stringify(err));
      }
    }
  }

  //

  onConnect() {
    this.logger(`connected to server at => ${this.url}`);
    this.socket.on("watcher", this.onWatcher.bind(this));
    this.socket.on("answer", this.onAnswer.bind(this));
    this.socket.on("candidate", this.onCandidate.bind(this));
    this.socket.on("disconnectPeer", this.onDisonnectPeer.bind(this));
    this.socket.on("disconnect", this.onDisconnect.bind(this));
    this.init();
  }

  onDisconnect() {
    for (const [key, conn] of Object.entries(this.peerConnections)) {
      if (conn) conn.close();
      delete this.peerConnections[key];
    }
  }
  //

  async onCandidate(id: string, candidate: RTCIceCandidateInit) {
    try {
      const newCandidate = new RTCIceCandidate(candidate);

      await this.peerConnections[id].addIceCandidate(newCandidate);
      this.logger("New Ice Candidate Added");
    } catch (err) {
      console.error(err);
    }
  }

  //

  async onWatcher(id: string) {
    this.logger(`New Watcher Added => ${id}`);
    const peerConnection = new RTCPeerConnection(this.config);
    if (this.peerConnections[id]) {
      this.peerConnections[id].close();
    }
    this.peerConnections[id] = peerConnection;

    if (this.videoStream) {
      for (const track of this.videoStream.getTracks()) {
        peerConnection.addTrack(track, this.videoStream);
      }
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit("candidate", id, event.candidate);
      }
    };

    const sdp = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(sdp);
    this.logger(`Sending offer to Watcher => ${id}`);
    this.socket.emit("offer", id, peerConnection.localDescription);
  }

  //

  onDisonnectPeer(id: string) {
    this.logger(`Watcher disconnected from stream => ${id}`);
    if (this.peerConnections[id]) this.peerConnections[id].close();
    delete this.peerConnections[id];
  }

  //

  async onAnswer(id: string, description: RTCSessionDescriptionInit) {
    this.logger(`Watcher Answered => ${id}`);
    try {
      await this.peerConnections[id].setRemoteDescription(description);
    } catch (err) {
      window.location.reload();
    }
  }
}
