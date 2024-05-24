import User from "../database/model/User";
import app from "../app";
import { SocketRequest } from "app-request";
import { ForbiddenError } from "../core/Error";
import Logger from "../core/Logger";
import SocketHandlersClass from "./handlers";
import { Server, Socket } from 'socket.io'
import i18next from "i18next";

const http = require('http');
export const server = http.createServer(app);


export const IO: Server = new Server(server, {
  cors: {
    origin: '*'
  }
});

export const SocketHandlers = new SocketHandlersClass();

(() => {
  setInterval(() => {
    console.log("--------------------[sockets]--------------------");
    console.log(`${SocketHandlers.users.length} socket`)
    SocketHandlers.users.forEach(user => {
      const isConnected = IO.sockets.sockets.get(user.socketId)?.connected
      if (!isConnected) {
        SocketHandlers.users = SocketHandlers.users.filter(socketUser =>
          (socketUser.user._id !== user.user._id && socketUser.socketId !== user.socketId));
        console.log("Disconnect user", `User "${user.user.name}" disconnected from the application`);
        console.log("Disconnect user", `User "${user.user.name}" disconnected from the application`);
      } else {
        console.log(`user: ${user.user.name} (${user.user.role}) | Connected: ${isConnected}`);
      }
    })
    console.log("-------------------------------------------------");
  }, 10000);
})()


export default interface SocketUser {
  socketId: string;
  accessToken: string;
  user: User,
}


const onConnection = (socket: Socket) => {
  console.log('a socket connected');

  socket.emit('connected', "welcome to the web-socket service")

  // check user authentication middleware
  socket.use(([event, ...args]: any, next: any) => {
    const [token, ..._args] = args
    console.log("[[socket args]] => ", _args);
    try {
      if (event !== 'subscribe') SocketHandlers.isAuthenticated(socket);
      next();
    } catch (error) {
      console.log(error)
      throw new ForbiddenError(i18next.t("userNotSubscribed"))
    }
  });

  socket.on("subscribe", (data: SocketRequest) => SocketHandlers.subscribe(data, socket));
  // socket.on("onDeliveryUpdate", (data: SocketRequest) => SocketHandlers.onDeliveryUpdate(data, socket));
  socket.on("unsubscribe", () => SocketHandlers.unsubscribe(socket));
}

export const getOnlineUsers = () => SocketHandlers.countUsersOnline();

IO.on("connection", onConnection);