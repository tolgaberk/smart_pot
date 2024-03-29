// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { Application, IPot } from '../declarations';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { app: a, result } = context;
    const app = a as Application;

    const seq = app.get('sequelizeClient');
    const add_info = async (pot: IPot) => {
      // Get the user based on their id, pass the `params` along so
      // that we get a safe version of the user data
      const returnObj = { ...pot };
      const flowerId = pot.current_flower;
      if (flowerId) {
        const images = await seq.models.images.findAll({ where: { flowerId } });
        const [flower] = await seq.models.flowers.findAll({
          where: { id: flowerId },
        });
        const [flower_reference] = await seq.models.plant_reference.findAll({
          where: { flower_id: flowerId },
        });
        returnObj.images = images;
        returnObj.flower = flower;
        returnObj.flower_reference = flower_reference;
      }

      if (pot.id) {
        const pot_datas = await seq.models.pot_data.findAll({
          where: { pot_id: pot.id },
          limit: 3,
          order: [['createdAt', 'DESC']],
        });
        returnObj.data = pot_datas;
      }

      // Merge the message content to include the `user` object
      return returnObj;
    };
    if (context.result.data)
      context.result.data = await Promise.all(result.data.map(add_info));
    else context.result = await add_info(result);

    return context;
  };
};
