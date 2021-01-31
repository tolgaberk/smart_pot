// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const flowers = sequelizeClient.define(
    'flowers',
    {
      name: {
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
  (flowers as any).associate = function (models: any): void {
    // Define associations here
    flowers.hasMany(models.pot_data, {
      foreignKey: 'current_flower_id',
      onDelete: 'NO ACTION',
      foreignKeyConstraint: false,
    });
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return flowers;
}
