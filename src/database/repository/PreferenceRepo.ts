import { Types } from 'mongoose';
import Preference, { PreferenceModel } from '../model/Preference';
import User from '../model/User';


export default class PreferenceRepo {

  /** 
  * Create preference
  * @param preference (preference)
  * @returns preference
  **/

  public static async create(preference: Preference): Promise<Preference | any> {
    preference.createdAt = new Date();
    preference.updatedAt = new Date();

    const preference_ = await PreferenceModel.create(preference);
    return preference_.toObject();
  }

  /**
  * Remove preference by id
  * @param id (preference id)
  * @returns preference | null
  * */

  public static remove(id: Types.ObjectId): Promise<Preference | null> {
    return PreferenceModel.findByIdAndRemove(id).lean<Preference>().exec();
  }

  /**
   * * find user preference
   * @returns preference[]
   * */

  public static findByUser(user: User): Promise<Preference | null> {
    return PreferenceModel
      .findOne({ user })
      .populate('user')
      .lean<Preference>()
      .exec();
  }

  /**
  * update preference
  * @param preference (preference)
  * @returns preference | null
  * */

  public static update(preference: Preference): Promise<any> {
    preference.updatedAt = new Date();
    return PreferenceModel.updateOne({ _id: preference._id }, { $set: { ...preference } }, { new: true })
      .lean<Preference>()
      .exec();
  }

  /**
  * find all preferences
  * @returns preference[]
  * */

  public static find(): Promise<Preference[]> {
    return PreferenceModel
      .find()
      .populate('user')
      .lean<Preference[]>()
      .exec();
  }

  /**
  * find preference by id
  * @param id (preference)
  * @returns preference | null
  * */

  public static findById(id: Types.ObjectId): Promise<Preference | null> | null {
    return PreferenceModel.findById(id)
      .populate('user')
      .lean<Preference>()
      .exec();
  }

  /**
  * Count preferences 
  * @returns Number
  * */

  public static count(): Promise<any> {
    return PreferenceModel.countDocuments()
      .lean<Preference>()
      .exec();
  }
}