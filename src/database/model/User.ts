import { model, Schema, Document } from 'mongoose';
import { RoleCode } from './Role';
import Attachment from './Attachment';
import Preference from './Preference';



export enum verificationStatus {
  UNVERIFIED = "Unverified",
  PENDING = "Pending",
  CLOSED = 'Closed',
  VERIFIED = 'Verified'
}


export default interface User extends Document {
  firstname: string;
  lastname: string;
  name: string;
  tel: number;
  email: string;
  role: RoleCode;
  password: string;
  verified: boolean;
  enabled: boolean;
  preference?: Preference;
  createdAt?: Date;
  updatedAt?: Date;
  picture?: Attachment;
  details: any
}


const schema = new Schema<User>(
  {
    firstname: {
      type: Schema.Types.String,
      required: true,
      maxlength: 50,
    },
    lastname: {
      type: Schema.Types.String,
      required: true,
      maxlength: 50,
    },
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    tel: {
      type: Schema.Types.Number,
      required: true,
      unique: true,
      // select: false,
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    picture: {
      type: Schema.Types.ObjectId,
      ref: 'Attachment',
      index: true,
      required: false,
    },
    role: {
      type: Schema.Types.String,
      required: true,
      default: RoleCode.CLIENT,
      enum: [RoleCode.CLIENT, RoleCode.DOCTOR],
    },
    preference: {
      type: Schema.Types.ObjectId,
      ref: 'Preference',
      required: false,
      select: false,
      index: true
    },
    details: {
      type: Schema.Types.ObjectId,
      refPath: 'role',
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    enabled: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';


export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
