// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { Application } from '../declarations';
import { Command } from '../services/pot_data/Command';

export default (): Hook => {
  return async (
    context: HookContext<{
      current_flower?: number;
      ip?: string;
      user_id?: number;
      name?: string;
    }>,
  ): Promise<HookContext> => {
    const { app: a, id, data } = context;
    const isFlowerChangeCommand = !data?.ip && !data?.user_id && !data?.name;
    if (data && isFlowerChangeCommand) {
      const app = a as Application;
      const service = app.service('pot-data');
      const flowerReferenceModel =
        app.get('sequelizeClient').models.plant_reference;

      const flower = await flowerReferenceModel.findOne({
        where: { flower_id: data.current_flower },
      });
      const command = new Command('flower_change', flower);
      service.pushCommand(id as number, command);
    }

    return context;
  };
};
