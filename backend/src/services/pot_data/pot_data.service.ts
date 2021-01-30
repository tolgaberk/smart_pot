// Initializes the `pot_data` service on path `/pot-data`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PotData } from './pot_data.class';
import createModel from '../../models/pot_data.model';
import hooks from './pot_data.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'pot-data': PotData & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/pot-data', new PotData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pot-data');

  service.hooks(hooks);
}
