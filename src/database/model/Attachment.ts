import { Schema, model, Document } from 'mongoose';
import User from './User';


export const enum AttachmentAs {
  AVATAR = 'AVATAR',
  COVER = 'COVER',
  MESSAGE = 'MESSAGE',
  ECHOGRAPHIE = 'ECHOGRAPHIE',
  X_RAY = 'X-RAY',
  STATE = 'STATE',
}



export default interface Attachment extends Document {
  _id: string | Schema.Types.ObjectId;
  user: User;
  fieldname?: string;
  originalname?: string;
  encoding: string;
  mimetype: string,
  size?: number,
  destination?: string,
  filename?: string,
  path: string,
  createdAt: Date,
  as: AttachmentAs
}



const schema = new Schema(
  {
    fieldname: {
      type: Schema.Types.String,
      required: false,
      trim: true,
      maxlength: 200
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    originalname: {
      type: Schema.Types.String,
      required: false,
      trim: true,
      maxlength: 200
    },
    encoding: {
      type: Schema.Types.String,
      required: true
    },
    mimetype: {
      type: Schema.Types.String,
      required: true,
    },
    destination: {
      type: Schema.Types.String,
      required: false,
    },
    filename: {
      type: Schema.Types.String,
      required: false,
    },
    path: {
      type: Schema.Types.String,
      required: true,
    },
    size: {
      type: Schema.Types.Number,
      required: false,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    as: {
      type: Schema.Types.String,
      required: true,
      enum: [AttachmentAs.AVATAR, AttachmentAs.COVER, AttachmentAs.ECHOGRAPHIE, AttachmentAs.MESSAGE, AttachmentAs.STATE, AttachmentAs.X_RAY]
    },
  },
  {
    versionKey: false,
  },
);


const DOCUMENT_NAME = 'Attachment';
const COLLECTION_NAME = 'attachments';


export const AttachmentModel = model<Attachment>(DOCUMENT_NAME, schema, COLLECTION_NAME);
