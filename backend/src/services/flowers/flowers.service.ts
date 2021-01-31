// Initializes the `flowers` service on path `/flowers`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Flowers } from './flowers.class';
import createModel from '../../models/flowers.model';
import hooks from './flowers.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'flowers': Flowers & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/flowers', new Flowers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('flowers');

  service.hooks(hooks);
}
