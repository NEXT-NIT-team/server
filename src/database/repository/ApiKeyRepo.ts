import ApiKey, { ApiKeyModel } from '../model/ApiKey';
import { RoleCode } from '../model/Role';

export default class ApiRepo {


  /**
  * Find API key
  * @param key (string)
  * @returns APIkey | null
  * */



  public static async findByKey(key: string): Promise<ApiKey | null> {
    return ApiKeyModel.findOne({ key: key, status: true }).lean<ApiKey>().exec();
  }


  /**
  * does collection exists
  * @returns Boolean
  * */


  public static async isInitialized(): Promise<Boolean> {
    return (await ApiKeyModel.find().lean<ApiKey[]>().exec()).length > 0;
  }


  /**
  * Initialize api key
  * @returns Attachment Object
  * */



  public static async seed(): Promise<ApiKey[] | undefined> {
    if (await this.isInitialized()) return;
    return ApiKeyModel.insertMany([
      {
        metadata: 'Used for DOCTOR only',
        key: '6c1caa9a5f384c2ce757af78c43583f9',
        role: RoleCode.DOCTOR,
        version: 1,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        metadata: 'Used for CLIENT only',
        key: '4076dd20bc7d957a9132d66aecaae2cc',
        role: RoleCode.CLIENT,
        version: 1,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }
}
