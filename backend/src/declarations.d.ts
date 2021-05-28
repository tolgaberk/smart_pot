// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}
// The application instance type that will be used everywhere else
export type Application =
  import('@feathersjs/express').Application<ServiceTypes>;
interface IPotData {
  id: number;
  environment_temp: number;
  environment_humidity: number;
  soil_moisture: number;
  tank_filled_ratio: number;
  environment_light_density: number;
  close_light_density: number;
  last_time_watered: Date;
  is_lights_open: boolean;
  pot_id: number;
  current_flower_id: number;
  createdAt: Date;
  updatedAt: Date;
}
interface IFlowerReference {
  min_temp: number;
  max_temp: number;
  min_light_exposure: number;
  min_moisture: number;
  max_moisture: number;
}

export interface ICamera {
  data: { id: string; data: string };
}

interface IImage {
  id: number;
  path: string;
  resourceId: number;
  createdAt: Date;
  updatedAt: Date;
  flowerId: number;
  blogId: number;
}

interface IPot {
  images: IImage[];
  id: number;
  name?: string;
  user_id?: number;
  MAC: string;
  ip: string;
  createdAt: string;
  updatedAt: string;
  current_flower?: number;
  data?: IPotData[];
  flower?: IFlower;
  flower_reference?: IFlowerReference;
}

interface IFlower {
  id: number;
  name: string;
  family: string;
  source: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  images?: IImage[];
}
