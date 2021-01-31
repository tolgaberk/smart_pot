import { Params } from '@feathersjs/feathers';
import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Application, IPotData } from '../../declarations';

export class PotData extends Service<IPotData> {
  app: Application;
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }
  async create(data: IPotData, params: Params): Promise<any> {
    console.log(data);
    if (((data.last_time_watered as unknown) as boolean) === true) {
      data.last_time_watered = new Date();
    } else {
      const model = this.app.get('sequelizeClient').models.pot_data;
      const a = await model.findOne({
        order: [['last_time_watered', 'DESC']],
        where: { pot_id: data.pot_id },
      });
      if (a) {
        data.last_time_watered = a.last_time_watered;
      } else {
        data.last_time_watered = new Date(0);
      }
    }
    await super.create(data, params);

    // return value will be a command to the smart pot
    return 'Success';
  }
}
