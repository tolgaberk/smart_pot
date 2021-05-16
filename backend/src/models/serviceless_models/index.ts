import { Application } from '../../declarations';
import images from './images.model';
import plant_references from './plant_reference.model';
export default function (app: Application): void {
  images(app);
  plant_references(app);
}
