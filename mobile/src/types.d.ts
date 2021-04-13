declare module '*.png';
interface IFlower {
  id: number;
  name: string;
  family: string;
  source: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  images: IImage[];
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
  name: string;
  user_id: number;
  MAC: string;
  ip: string;
  createdAt: string;
  updatedAt: string;
  current_flower: number;
  data?: IPotData[];
}

interface IPotData {
  id: number;
  environment_temp: number;
  environment_humidity: number;
  soil_moisture: number;
  tank_filled_ratio: number;
  environment_light_density: number;
  close_light_density: number;
  last_time_watered: string;
  is_lights_open: boolean;
  pot_id: number;
  current_flower_id: number;
  createdAt: string;
  updatedAt: string;
}
