import { Schema, model, Document } from 'mongoose';


export enum RoleCode {
  CLIENT = "CLIENT",
  DOCTOR = "DOCTOR"
}

export default interface Role extends Document {
  code: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    code: {
      type: Schema.Types.String,
      required: true,
      default: RoleCode.CLIENT,
      enum: [RoleCode.DOCTOR, RoleCode.CLIENT],
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      default: new Date(),
    },
  },
  {
    versionKey: false,
  },
);


const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'roles';

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
