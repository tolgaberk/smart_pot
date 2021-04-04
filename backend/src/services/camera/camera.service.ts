// Initializes the `camera` service on path `/camera`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Camera } from './camera.class';
import createModel from '../../models/camera.model';
import hooks from './camera.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    camera: Camera & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/camera', new Camera(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('camera');

  service.hooks(hooks);
}
