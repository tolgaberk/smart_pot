// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application, IPotData } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');

  const potData = sequelizeClient.define<Model<IPotData, any>>(
    'pot_data',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      environment_temp: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      environment_humidity: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      soil_moisture: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      tank_filled_ratio: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      environment_light_density: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      close_light_density: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      last_time_watered: {
        //  NodeMCU da saat modulu olmadigindan true veya false gelecek true geldiginde saati setleyecegiz.
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_lights_open: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      pot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      current_flower_id: { type: DataTypes.INTEGER },
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
  (potData as any).associate = function (models: any): void {
    // Define associations here

    potData.belongsTo(models.pots, {
      foreignKey: 'pot_id',
      onDelete: 'NO ACTION',
      foreignKeyConstraint: false,
    });
    potData.belongsTo(models.flowers, {
      foreignKey: 'current_flower_id',
      onDelete: 'NO ACTION',
      foreignKeyConstraint: false,
    });
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return potData;
}

//- [ ]  environment_temp
//- [ ]  environment_humidity
//- [ ]  soil_moisture
//- [ ]  tank_filled_ratio
//- [ ]  environment_light_density
//- [ ]  close_light_density
//- [ ]  last_time_watered
//- [ ]  is_lights_open
//- [ ]  pot_id
