// Initializes the `blogs` service on path `/blogs`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Blogs } from './blogs.class';
import createModel from '../../models/blogs.model';
import hooks from './blogs.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'blogs': Blogs & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/blogs', new Blogs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('blogs');

  service.hooks(hooks);
}
