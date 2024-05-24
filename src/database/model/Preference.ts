import { Schema, model, Document } from 'mongoose';
import User from './User';


export enum Language {
  FR = 'FR',
  EN = 'EN',
  AR = 'AR',
}

export const default_preference = {
  language: Language.FR,
  notifications: true,
  darkMode: false,
} as any


export default interface Preference extends Document {
  user: User;
  language: Language;
  notifications?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  /* preferences indexes 
  * index [0] okay 
  * index [1] maybe
  * index [3] not okay 
  */

  darkMode: boolean;
}

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    language: {
      type: Schema.Types.String,
      required: false,
      default: Language.EN,
      enum: [Language.FR, Language.EN, Language.AR]
    },
    notifications: {
      type: Schema.Types.Boolean,
      required: false,
      default: true
    },
    darkMode: {
      type: Schema.Types.Boolean,
      required: false,
      default: false
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);


const DOCUMENT_NAME = 'Preference';
const COLLECTION_NAME = 'preferences';

export const PreferenceModel = model<Preference>(DOCUMENT_NAME, schema, COLLECTION_NAME);
