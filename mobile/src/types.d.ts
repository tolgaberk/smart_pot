declare module '*.png';
interface IFlower {
  name: string;
  family: string;
  source: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  images: IImage[];
}

interface IImage {
  path: string;
  flowerId?: number;
  blogId?: number;
}
