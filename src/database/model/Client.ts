import { model, Schema, Document } from 'mongoose';
import User from './User';
import IDoctor from './Doctor';
import Attachment from './Attachment';


export default interface IClient extends User {
  isMale: boolean;
  followed_doctors: IDoctor[],
  docs: Attachment[]
  blood_presure: number[]
  blood_sugar_level: number[]
  height: number
  weight: number
}


const schema = new Schema(
  {
    isMale: {
      type: Schema.Types.Boolean,
      default: true,
    },
    followed_doctors: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    docs: [{
      type: Schema.Types.ObjectId,
      ref: 'Attachment',
    }],
    blood_presure: {
      type: [Schema.Types.Number],
      length: 25,
      default: [0, 0],
    },
    blood_sugar_level: {
      type: Schema.Types.Number,
      default: 0,
    },
    height: {
      type: Schema.Types.Number,
      required: true
    },
    weight: {
      type: Schema.Types.Number,
      required: true
    }
  },
  {
    versionKey: false,
  },
);


const DOCUMENT_NAME = 'Client';
const COLLECTION_NAME = 'clients';


export const ClientModel = model<IClient>(DOCUMENT_NAME, schema, COLLECTION_NAME);
