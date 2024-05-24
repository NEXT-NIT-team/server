import { Request } from 'express';
import User from '../database/model/User';
import Keystore from '../database/model/Keystore';
import Attachment from '../database/model/Attachment';
import { RoleCode } from '../database/model/Role';

declare interface PublicRequest extends Request {
  file?: Attachment | File | any
  files?: Attachment[] | File[] | any
  apiKey: string;
  role: RoleCode;
  i18n: any;
  t: any;
  clientLanguage: string;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCode: RoleCode;
}

declare interface ProtectedRequest extends RoleRequest {
  user: User;
  accessToken: string;
  keystore: Keystore;
}

declare interface SocketRequest {
  token: string,
  data: any,
  to?: Types.ObjectId;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}

declare interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}