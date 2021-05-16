// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const plant_reference = sequelizeClient.define(
    'plant_reference',
    {
      min_temp: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      max_temp: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      min_light_exposure: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      min_moisture: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      max_moisture: {
        type: DataTypes.FLOAT,
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
  (plant_reference as any).associate = function (models: any): void {
    // Define associations here
    plant_reference.belongsTo(models.flowers, {
      foreignKey: 'flower_id',
      targetKey: 'id',
    });
    // plant_reference.hasOne(models.flowers, {
    //   foreignKey: 'resourceId',
    // });
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return plant_reference;
}
