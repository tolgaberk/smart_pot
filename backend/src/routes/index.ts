import { Application } from '../declarations';
import logger from '../logger';
export default function (app: Application): void {
  const reqLogger = (req: Request, _: any, next: any) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  };

  app.use(reqLogger);
}
