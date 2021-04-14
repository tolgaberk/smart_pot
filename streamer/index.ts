import io from "socket.io-client";

const socket = io("https://smartpot.online");

const statusText = document.querySelector(".status")!;

const video = document.createElement("video");

function addStatus(txt: string) {
  statusText.innerHTML += `<h2>${txt}</h2>`;
}

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      console.log(stream.getVideoTracks());
      socket.emit("broadcaster");
      video && (video.srcObject = stream);
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}

// socket.on("camera_data", (data: string) => img && (img.src = data));

socket.on("connect", () => {
  addStatus("Connected To Socket");
  console.log("connected");

  const peerConnections: Record<any, RTCPeerConnection> = {};
  const config = {
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

  socket.on("watcher", (id: any) => {
    addStatus(`New Watcher ${id}`);
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;

    let stream: MediaStream = video?.srcObject as any;
    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", id, event.candidate);
      }
    };

    peerConnection
      .createOffer()
      .then((sdp) => peerConnection.setLocalDescription(sdp))
      .then(() => {
        socket.emit("offer", id, peerConnection.localDescription);
      });
  });

  socket.on("answer", (id: any, description: RTCSessionDescriptionInit) => {
    peerConnections[id].setRemoteDescription(description);
  });

  socket.on("candidate", (id: any, candidate: RTCIceCandidateInit) => {
    peerConnections[id]
      .addIceCandidate(new RTCIceCandidate(candidate))
      .catch(console.log);
  });

  socket.on("disconnectPeer", (id: any) => {
    addStatus(`disconnected ${id}`);
    console.log(peerConnections);
    peerConnections[id].close();
    delete peerConnections[id];
  });
});
