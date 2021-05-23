import type io from 'socket.io';
import { Application } from '../declarations';
type PotConnection = {
  potMAC: string;
  socketID: string;
  watchers: string[];
};

type ConnectedPots = Record<string, PotConnection>;

type Connections = Record<string, RTCSocket>;

export default class RTCController {
  streamerPots: ConnectedPots = {};
  connections: Connections = {};
  constructor(public io: io.Server, private app: Application) {
    this.io.on('connection', this.onConnection.bind(this));
    return this;
  }

  onConnection(socket: io.Socket) {
    console.log('CONNECTIONS =>', Object.keys(this.connections));
    this.connections[socket.id] = new RTCSocket(
      socket,
      this.app,
      this.streamerPots,
      this.connections,
    );
  }
}
class RTCSocket {
  constructor(
    private socket: io.Socket,
    private app: Application,
    private pots: ConnectedPots,
    private connections: Connections,
  ) {
    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('broadcaster', this.onBroadCaster.bind(this));
    this.socket.on('watcher', this.onWatcher.bind(this));
    this.socket.on('answer', this.onAnswer.bind(this));
    this.socket.on('offer', this.onOffer.bind(this));
    this.socket.on('candidate', this.onCandidate.bind(this));
    this.socket.on('water', this.onWater.bind(this));
    this.socket.on(
      'disconnectFromBroadcaster',
      this.onDisconnectFromBroadCaster.bind(this),
    );
    this.socket.on('light_toggle', this.onLightToggle.bind(this));
  }
  onDisconnect() {
    console.log(`Deleting ${this.socket.id}`);
    delete this.connections[this.socket.id];
  }
  onBroadCaster(potMAC: string) {
    console.log('New BroadCaster!');
    //record pot as broadcaster
    this.pots[potMAC] = { socketID: this.socket.id, potMAC, watchers: [] };
    console.table(this.pots);
  }
  onWatcher(potMAC: string) {
    console.log(`New Watcher for => ${potMAC}!`);
    // forward event to related pot
    const pot = this.pots[potMAC];
    if (pot) {
      this.socket.to(pot.socketID).emit('watcher', this.socket.id);
      pot.watchers.push(this.socket.id);
      console.log(`Watchers of ${potMAC}`);
      console.table(pot.watchers);
    }
  }
  onDisconnectFromBroadCaster(potMAC: string) {
    console.log(`${this.socket.id} => Disconnected from ${potMAC}`);
    //forward event to related pot
    const pot = this.pots[potMAC];
    if (pot) {
      this.socket.to(pot.socketID).emit('disconnectPeer', this.socket.id);

      pot.watchers = pot.watchers.filter((item) => item !== this.socket.id);

      console.log(`Current Watchers of ${potMAC}`);
      console.table(pot.watchers);

      this.pots[potMAC] = pot;
    }
  }

  // ? WebRTC EVENTS BEGIN
  onOffer(id: string, description: string) {
    //forward event both ways
    this.socket.to(id).emit('offer', this.socket.id, description);
  }
  onAnswer(id: string, description: string) {
    //forward event both ways
    this.socket.to(id).emit('answer', this.socket.id, description);
  }
  onCandidate(id: string, description: string) {
    //forward event both ways
    this.socket.to(id).emit('candidate', this.socket.id, description);
  }
  // ? WebRTC EVENTS END
  onWater(potId: number, callback?: (val: any) => void) {
    console.log('wants to water =>', potId);

    try {
      const returnVal = this.app.service('pot-data').water(potId);
      callback && callback(returnVal);
    } catch (e) {
      console.error(e);
    }
  }
  onLightToggle(potId: number, callback?: (val: any) => void) {
    console.log('wants to water =>', potId);

    try {
      const returnVal = this.app.service('pot-data').light_toggle(potId);
      callback && callback(returnVal);
    } catch (e) {
      console.error(e);
    }
  }
}
