import SocketUser, { IO } from "..";
import { Authentification } from "../../auth/authentication";
import { ForbiddenError } from "../../core/Error";
import Logger from "../../core/Logger";
import UserRepo from "../../database/repository/UserRepo";

export default class SocketHandlersClass {

  public users: SocketUser[] = [];



  /**
 * @summary retrieve number of online users
 * @returns number of users
 * */

  public countUsersOnline() {
    return this.users.length;

  }

  /**
* @summary check user status
* @param socket (string)
* @returns void
* */

  public isAuthenticated(socket: any) {
    try {

      console.log('isAuthenticated...')
      console.log(socket.id)

      const user = this.users.find((u: any) => u.socketId == socket.id);
      if (!user) throw new ForbiddenError('User Unauthorized to use socket');
    } catch (error) {
      console.log(error)
    }
  };

  /**
 * @summary add user to connected users list
 * @param token (string)
 * @returns void
 * */

  public async subscribe({ token }: any, socket: any) {

    try {
      console.log('Subscribing...')
      console.log("Subscribing...");

      const token_ = 'Bearer ' + token;
      const { user, keystore, accessToken } = await Authentification(token_)
      if (!user) return;

      // check if the user already exist in the Users list
      const index = this.users.findIndex((u: any) => u.accessToken == token);

      if (index == -1) this.users.push({ socketId: socket.id, accessToken, user } as SocketUser)
      else this.users[index] = { socketId: socket.id, accessToken, user };

      this.updateActivity();
      console.log(`[socket] => ${user.name}'s (${user.role}) socket has been subscribed`);

      return { socketId: socket.id, accessToken, user };
    } catch (error) {
      console.log(error)
    }
  };

  /**
   * @summary remove user from users list
   * @returns void
   **/

  public unsubscribe = function (socket: any) {
    this.users = this.users.filter((user: SocketUser) => user.socketId !== socket.id);
    this.updateActivity();
    console.log(`[socket] => ${socket.id}'s socket has been unsubscribed`);
  };


  /**
   * @summary send online users to subscribers
   * @returns void
   **/

  public updateActivity() {

    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      // remove sensitive data
      const activeUsers = this.users.map(u => u.user._id);


    }
  };

  /**
   * @summary update user objects
   * @returns void
   */

  public async updateUsers() {
    for (let index = 0; index < this.users.length; index++) {
      const socketHandler = this.users[index];
      const user = await UserRepo.findById(socketHandler.user._id)
      this.users[index].user = user!
    }
  }


  public async onDeliveryStatusUpdate({ token, data }: any, socket: any) {
    try {

    } catch (error) {
      console.log(error)
    }
  };

}