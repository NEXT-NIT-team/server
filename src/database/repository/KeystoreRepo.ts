import Keystore, { KeystoreModel } from '../model/Keystore';
import { Types } from 'mongoose';
import User from '../model/User';

export default class KeystoreRepo {


/**
* Find client keystore with access token
* @param client (User)
* @param primaryKey (string)
* @returns Keystore Object
* */


  public static findforKey(client: User, primaryKey: string): Promise<Keystore | null> {
    return KeystoreModel.findOne({ client, primaryKey, status: true }).exec();
  }

/**
* Remove Keystore
* @param id (keystore id)
* @returns Keystore | null
* */



  public static remove(id: Types.ObjectId): Promise<Keystore | null> {
    return KeystoreModel.findByIdAndRemove(id).lean<Keystore>().exec();
  }


/**
* Find client keystore with same keys
* @param client (User)
* @param primaryKey (string)
* @param secondaryKey (string)
* @returns Keystore Object
* */


  public static find(
    client: User,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore | null> {
    return KeystoreModel.findOne({
      client,
      primaryKey,
      secondaryKey,
    })
      .lean<Keystore>()
      .exec();
  }


/**
* Create client keystore
* @param client (User)
* @param primaryKey (string)
* @param secondaryKey (string)
* @returns Keystore Object
* */



  public static async create(
    client: User,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore | any> {
    const now = new Date();
    const keystore = await KeystoreModel.create({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
      createdAt: now,
      updatedAt: now,
    } as Keystore);
    return keystore.toObject();
  }
}
