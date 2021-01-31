import { Params } from '@feathersjs/feathers';
import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Application, IPot } from '../../declarations';

export class Pots extends Service {
  model;
  app;
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
    this.model = options.Model;
  }

  async create(data: { data: string }, params: Params): Promise<any> {
    const [ip, MAC] = data.data.split('&&');
    const pot: IPot = { ip, MAC };
    const exists = await this.find({ query: { MAC } });
    console.log(exists);
    let id;
    if ((exists as any).data[0]) {
      const patched = await this.model.update({ ip }, { where: { MAC } });
      console.log(patched);
      id = patched[0];
    } else {
      const created = await super.create(pot, params);
      id = created.id;
    }

    return id;
  }
}
