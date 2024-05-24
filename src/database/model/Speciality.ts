import { Schema, model, Document } from "mongoose";

export default interface ISpeciality extends Document {
  name: string,
  description: string
}

const schema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 100,
  },
}, {
  timestamps: true,
  versionKey: false,
})

const DOCUMENT_NAME = 'Speciality';
const COLLECTION_NAME = 'specialities';


export const UserModel = model<ISpeciality>(DOCUMENT_NAME, schema, COLLECTION_NAME);
