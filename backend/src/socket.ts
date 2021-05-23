import io from 'socket.io';
import RTCController from './controllers/RTCController';
import { Application } from './declarations';
export default (io: io.Server, app: Application): void => {
  const socketController = new RTCController(io, app);

  socketController.io.on('connection', (socket) => {
    socket.on('camera_data', (data) => io.emit('camera_data', data));
  });
};
