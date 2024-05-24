import { Types } from 'mongoose';
import Client, { ClientModel } from '../model/Client';


export default class ClientRepo {

  /** 
  * Create client
  * @param client (client)
  * @returns client
  * */

  public static async create(client: Client): Promise<Client | any> {

    const client_ = await ClientModel.create(client);
    // populate and return
    return (await client_.execPopulate()).toObject()
  }

  /**
  * Remove client by id
  * @param id (client id)
  * @returns client | null
  * */

  public static remove(id: Types.ObjectId): Promise<Client | null> {
    return ClientModel.findByIdAndRemove(id).lean<Client>().exec();
  }

  /**
  * update client
  * @param client (client)
  * @returns client | null
  * */

  public static update(client: Client): Promise<any> {
    client.updatedAt = new Date();
    return ClientModel.updateOne({ _id: client._id }, { $set: { ...client } }, { new: true })
      .lean<Client>()
      .exec();
  }

  /**
  * find all clients
  * @returns client[]
  * */

  public static find(): Promise<Client[]> {
    return ClientModel
      .find()
      .lean<Client[]>()
      .exec();
  }

  /**
  * find client by id
  * @param id (client)
  * @returns client | null
  * */

  public static findById(id: Types.ObjectId): Promise<Client | null> | null {
    return ClientModel.findById(id)
      .lean<Client>()
      .exec();
  }

  /**
  * Count clients 
  * @returns Number
  * */

  public static count(): Promise<any> {
    return ClientModel.countDocuments()
      .lean<Client>()
      .exec();
  }
}