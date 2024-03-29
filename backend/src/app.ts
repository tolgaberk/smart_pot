import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import feathers, {
  HookContext as FeathersHookContext,
} from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import favicon from 'serve-favicon';
import appHooks from './app.hooks';
import authentication from './authentication';
import channels from './channels';
import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import serviceless_models from './models/serviceless_models';
import routes from './routes';
import seeder from './seeder';
import sequelize from './sequelize';
import services from './services';
import socket from './socket';

// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());
export type HookContext<T = any> = {
  app: Application;
} & FeathersHookContext<T>;

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(cors());
app.use(compress());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers

app.configure(express.rest());

app.configure(socketio((io) => socket(io, app)));
app.configure(sequelize);
app.configure(routes);
app.configure(serviceless_models);

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware);

app.configure(authentication);
// Set up our services (see `services/index.ts`)
app.configure(services);
// Set up event channels (see channels.ts)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);

app.configure(seeder);
export default app;
