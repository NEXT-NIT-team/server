import './database'; // initialize database
import './socket'; // initialize socket

import { port } from "./config";
import Logger from "./core/Logger";
import { server } from './socket';

server
  .listen(port, () => Logger.info(`server running on port : ${port}`))
  .on('error', (e: any) => Logger.error(e));
