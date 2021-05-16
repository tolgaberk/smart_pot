// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (key = 'flowerId'): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { app, result, params } = context;
    const seq = app.get('sequelizeClient');
    const addImages = async (entity) => {
      // Get the user based on their id, pass the `params` along so
      // that we get a safe version of the user data
      const relatedId = entity.id;
      const images = await seq.models.images.findAll({
        where: { [key]: relatedId },
      });

      // Merge the message content to include the `user` object
      return {
        ...entity,
        images,
      };
    };
    if (context.result.data)
      context.result.data = await Promise.all(result.data.map(addImages));
    else context.result = await addImages(result);

    return context;
  };
};
