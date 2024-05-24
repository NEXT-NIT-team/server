import './database'; // initialize database
import './socket'; // initialize socket

import { port } from "./config";
import Logger from "./core/Logger";
import { server } from './socket';

server
  .listen(port, () => console.log(`server running on port : ${port}`))
  .on('error', (e: any) => console.log(e));
