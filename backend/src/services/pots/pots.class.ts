import { Paginated, Params } from '@feathersjs/feathers';
import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Application, IPot } from '../../declarations';
export class Pots extends Service<IPot> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(
    options: Partial<SequelizeServiceOptions>,
    private app: Application,
  ) {
    super(options);
  }

  async create(data: Partial<IPot>, params: Params): Promise<any> {
    const [ip, MAC] = (data as unknown as { data: string }).data.split('&&');
    const pot: Partial<IPot> = { ip, MAC };
    console.log(pot);
    const exists = (await this.find({ query: { MAC } })) as Paginated<IPot>;
    const existingRecord = exists.data[0];
    if (existingRecord) {
      try {
        const patched = (await this.patch(existingRecord.id, { ip })) as IPot;
        const flower = await this.app
          .get('sequelizeClient')
          .models.plant_reference.findOne({
            where: { flower_id: patched.current_flower },
          });
        return { id: (patched as IPot).id, flower };
      } catch (err) {
        console.error(err);
        return { err: err.toString() };
      }
    } else {
      const created = (await super.create(pot, params)) as IPot;
      return { id: created.id };
    }
  }
}
