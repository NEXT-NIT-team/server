import Role, { RoleCode, RoleModel } from '../model/Role';
import User from '../model/User';

export default class RoleRepo {


  /**
   * Find role by code
   * @param code (RoleCode)
   * @returns Role Object
   * */


  public static findByCode(code: RoleCode): Promise<Role | null> {
    return RoleModel.findOne({ code, status: true }).lean<Role>().exec();
  }



  /**
  * does collection exists
  * @returns Boolean
  * */

  public static async isInitialized(): Promise<Boolean> {
    return (await RoleModel.find().lean<Role[]>().exec()).length > 0;
  }


  /**
   * Initialize roles to db
   * @returns Inserted object
   * */


  public static async seed() {
    if (await this.isInitialized()) return;

    return RoleModel.insertMany([
      { code: RoleCode.DOCTOR, status: true, createdAt: new Date(), updatedAt: new Date() },
      { code: RoleCode.CLIENT, status: true, createdAt: new Date(), updatedAt: new Date() }
    ]);
  }
}