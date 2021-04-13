// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application, IPot } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');

  const pots = sequelizeClient.define<Model<Partial<IPot>, any>>(
    'pots',
    {
      id: { primaryKey: true, type: DataTypes.INTEGER, autoIncrement: true },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      MAC: {
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

      timestamps: true,
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (pots as any).associate = function (models: any): void {
    // Define associations here
    pots.hasMany(models.pot_data, { foreignKey: 'pot_id' });
    pots.belongsTo(models.users, { foreignKey: 'user_id' });
    pots.belongsTo(models.flowers, { foreignKey: 'current_flower' });
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return pots;
}
