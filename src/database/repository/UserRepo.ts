import User, { UserModel, verificationStatus } from '../model/User';
import fs from 'fs'
import Handlebars from 'handlebars';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { resolve } from 'path';
import Role, { RoleCode, RoleModel } from '../model/Role';
import { InternalError, NotFoundError } from '../../core/Error';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import RoleRepo from './RoleRepo';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { db } from '../../config';
import IClient from '../model/Client';
import IDoctor from '../model/Doctor';
import PreferenceRepo from './PreferenceRepo';
import Preference, { Language, default_preference } from '../model/Preference';


export default class UserRepo {

  private static readonly details = {
    path: 'details',
    select: '+mobile',
  }

  /**
   * Contains critical information of the user
   * @param id
   * @returns User object
   * */

  public static findById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findById(id)
      .populate('picture')
      .populate('preference')
      .populate('device')
      .populate(this.details)
      .select('+password +tel +role +picture')
      .lean<User>()
      .exec();
  }

  /**
   * Contains critical information of the user,
   * find by phone
   * @param id
   * @returns User object
   * */

  public static findByPhone(tel: number): Promise<User | null> {
    return UserModel.findOne({ tel })
      .select('+email +tel +password +role')
      .populate('preference')
      .populate('picture')
      .populate(this.details)
      .lean<User>()
      .exec();
  }

  /**
   * find user by User filter
   */

  public static findOne(user: User): Promise<User | null> {
    return UserModel.findOne(user as any)
      .populate('preference')
      .populate('picture')
      .populate(this.details)
      .lean<User>()
      .exec();
  }

  /**
   * Contains critical information of the user,
   * find by email
   * @param id
   * @returns User object
   * */

  public static findByEmail(email: string, role?: RoleCode): Promise<User | null> {
    email = email.toLowerCase();
    const filter = role ? { email, role } : { email };
    return UserModel.findOne(filter)
      .select('+email +tel +password +role')
      .populate('preference')
      .populate('picture')
      .populate(this.details)
      .lean<User>()
      .exec();
  }



  /**
   * Contains user public details
   * @param id
   * @returns User object
   * */

  public static findDetails(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findById(id)
      .select('-password +tel +role')
      .populate('device', '-expoPushToken')
      .populate('picture')
      .populate(this.details)
      .lean<User>()
      .exec();
  }

  /**
   * find user by it's role object
   * @param id role object id
   * @returns User Object
   */

  public static findByDetailObject(details: IDoctor | IClient): Promise<User | null> {
    return UserModel.findOne({ details })
      .populate('device', '-expoPushToken')
      .populate('picture')
      .populate(this.details)
      .lean<User>()
      .exec();
  }

  /**
   * Find all users
   * @returns users[]
   * */

  public static findAll(): Promise<User[]> {
    return UserModel.find()
      .select('-password +tel +role +picture')
      .populate('picture')
      .populate('preference')
      .populate('device')
      .populate(this.details)
      .lean<User[]>().exec();
  }


  /**
   * find users by role
   * @param role
   * @returns users[]
   * */

  public static async findByRole(role: RoleCode): Promise<User[]> {
    return UserModel.find({ role })
      .populate('picture')
      .populate(this.details)
      .lean<User[]>().exec();
  }

  /**
   * find users by ids
   * @param ids[]
   * @returns users[]
   * */

  public static findIds(ids: User[]): Promise<User[]> {
    return UserModel.find().where('_id').in(ids).populate('picture').lean<User[]>().exec();
  }

  /**
   * capitalize string
   * @param s
   * @returns String
   * */

  public static capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  /**
   * Create user
   * @param user
   * @param accessTokenKey
   * @param refreshTokenKey
   * @param roleCode
   * @returns User
   * */

  public static async create(
    user: User,
    roleCode: RoleCode = RoleCode.CLIENT,
  ): Promise<{ user: User; keystore: Keystore } | any> {

    const password = user.password;

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    user.password = await bcrypt.hash(user.password, 10);

    user.email = user.email.toLowerCase()
    user.role = roleCode;
    user.firstname = this.capitalize(user.firstname);
    user.lastname = this.capitalize(user.lastname);
    user.name = user.firstname + ' ' + user.lastname;

    user.verified = true;

    const createdUser = await UserModel.create(user);
    
    const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
    return { user: createdUser.toObject(), keystore: keystore };
  }

  /**
   * Update user tokens
   * @param user
   * @param accessTokenKey
   * @param refreshTokenKey
   * @returns User
   * */

  public static async setTokens(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    user.updatedAt = new Date();
    await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
    const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    return { user: user, keystore: keystore };
  }

  /**
   * Update user info
   * @param user
   * @returns User
   * */

  public static update(user: User): Promise<User> {
    return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean<User>()
      .exec();
  }

  /**
   * Get last week new users
   * @returns Users[]
   * */

  public static findRecent(): Promise<User[]> {
    const now = new Date();
    return UserModel.find({
      createdAt: { $gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7) },
    })
      .sort({ createdAt: 'desc' })
      .select('_id createdAt')
      .populate('picture')
      .lean<User[]>()
      .exec();
  }

  /**
   * disable user account
   * @param id (token id)
   * @returns user | null
   * */

  public static findByIdAndDisable(_id: Types.ObjectId): Promise<User | null> {
    return UserModel.findByIdAndUpdate(_id, { enabled: false }).lean<User>().exec();
  }

  /**
   * enable user account
   * @param id 
   * @returns user | null
   * */

  public static findByIdAndEnable(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findByIdAndUpdate(id, { enabled: true }).lean<User>().exec();
  }


  /**
  * get user stats
  * @returns Object
  * */

  public static async stats(): Promise<Object> {

    const users = await this.findAll();
    // verified users
    const verified = users.filter((u: User) => u.verified).length;
    // accepted users
    const enabled = users.filter((u: User) => u.enabled).length;
    // male users
    const male = users.filter((u: User) => u.details.isMale).length;
    // * users
    const count = users.length;

    return { count, verified, enabled, male }
  }

}

