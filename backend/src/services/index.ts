import { Application } from '../declarations';
import users from './users/users.service';
import potData from './pot_data/pot_data.service';
import pots from './pots/pots.service';
import flowers from './flowers/flowers.service';
import camera from './camera/camera.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(potData);
  app.configure(pots);
  app.configure(flowers);
  app.configure(camera);
}
