// Initializes the `pots` service on path `/pots`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/pots.model';
import { Pots } from './pots.class';
import hooks from './pots.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    pots: Pots & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use('/pots', new Pots(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pots');

  service.hooks(hooks);
}
