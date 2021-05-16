import { Application } from '@feathersjs/feathers';
import io from 'socket.io';
import { ServiceTypes } from './declarations';
export default (io: io.Server, app: Application<ServiceTypes>): void => {
  let broadcaster: any;

  io.on('connection', (socket) => {
    // ! RTC socket commands
    socket.on('broadcaster', () => {
      broadcaster = socket.id;
      console.log('New Broadcaster', broadcaster);
      socket.broadcast.emit('broadcaster');
    });
    socket.on('watcher', () => {
      console.log('New Watcher', socket.id);
      socket.to(broadcaster).emit('watcher', socket.id);
    });
    socket.on('disconnectFromBroadcaster', () => {
      console.log(
        'disconnect from broadcaster',
        broadcaster,
        '\nwho? => ',
        socket.id,
      );
      socket.to(broadcaster).emit('disconnectPeer', socket.id);
    });
    socket.on('offer', (id, message) => {
      console.log('New offer', message);
      socket.to(id).emit('offer', socket.id, message);
    });
    socket.on('answer', (id, message) => {
      console.log('New Answer', message);
      socket.to(id).emit('answer', socket.id, message);
    });
    socket.on('candidate', (id, message) => {
      console.log('New Candidate', message);
      socket.to(id).emit('candidate', socket.id, message);
    });

    //

    socket.on('water', (potId, callback) => {
      console.log('wants to water =>', potId);

      try {
        callback(app.service('pot-data').water(potId));
      } catch (e) {
        console.error(e);
      }
    });

    socket.on('light_toggle', (potId, callback) => {
      console.log('wants to toggle =>', potId);
      try {
        callback(app.service('pot-data').light_toggle(potId));
      } catch (err) {
        console.error(err);
      }
    });
  });

  io.on('connection', (socket) => {
    socket.on('camera_data', (data) => io.emit('camera_data', data));
  });
};
