import { model, Schema, Document } from "mongoose";
import User from "./User";
import { RoleCode } from "./Role";

export enum VerificationType {
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

export default interface VerificationCode extends Document {
  code: string,
  user: User,
  type: VerificationType,
  role: RoleCode,
  createdAt: Date,
  updatedAt?: Date
}

const schema = new Schema({
  code: { type: String, required: true },
  type: { type: String, required: true, enum: VerificationType },
  role: { type: String, required: true, enum: RoleCode },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const DOCUMENT_NAME = 'VerificationCode';
const COLLECTION_NAME = 'VerificationCode'

export const VerificationCodeModel = model<VerificationCode>(DOCUMENT_NAME, schema, COLLECTION_NAME);