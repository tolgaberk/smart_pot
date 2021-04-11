import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ICamera } from '../../declarations';

export class Camera extends Service<ICamera> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async create(data: ICamera): Promise<any> {
    return data;
  }
}
