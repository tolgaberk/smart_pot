import { Params } from '@feathersjs/feathers';
import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Application, IPotData } from '../../declarations';
import { Command } from './Command';

export class PotData extends Service<IPotData> {
  app: Application;
  CommandQueue: Record<number, Command[]> = {};

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  //@ts-ignore
  async create(data: IPotData, params: Params): Promise<Command> {
    console.log(data);
    const potId = data.pot_id;

    data = await this.setLastTimeWatered(potId, data);

    await super.create(data, params);

    let toBeReturnedCommand = new Command('no_command');
    if (this.CommandQueue[potId] && this.CommandQueue[potId].length) {
      const lastCommand = this.CommandQueue[potId].pop();
      if (lastCommand) {
        toBeReturnedCommand = lastCommand.refreshTime();
      }
    }

    return toBeReturnedCommand;
  }

  private async setLastTimeWatered(potId: number, data: IPotData) {
    if ((data.last_time_watered as unknown as boolean) === true) {
      data.last_time_watered = new Date();
    } else {
      const model = this.app.get('sequelizeClient').models.pot_data;
      const pot_data = await model.findOne({
        order: [['last_time_watered', 'DESC']],
        where: { pot_id: potId },
      });

      if (pot_data) {
        data.last_time_watered = pot_data.last_time_watered;
      } else {
        data.last_time_watered = new Date(0);
      }
    }
    return data;
  }

  light_toggle(potId: number) {
    const command = new Command('toggle_lights');
    this.pushCommand(potId, command);
    return true;
  }

  water(potId: number) {
    const command = new Command('water');
    this.pushCommand(potId, command);
    return true;
  }

  pushCommand(potId: number, command: Command) {
    if (this.CommandQueue[potId]) {
      this.CommandQueue[potId].push(command);
    } else {
      this.CommandQueue[potId] = [command];
    }
    console.log('Command Pushed', this.CommandQueue);
  }
}
