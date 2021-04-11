// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const images = sequelizeClient.define(
    'images',
    {
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (images as any).associate = function (models: any): void {
    // Define associations here
    images.belongsTo(models.flowers);
    images.belongsTo(models.blogs);
    // images.hasOne(models.flowers, {
    //   foreignKey: 'resourceId',
    // });
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return images;
}
