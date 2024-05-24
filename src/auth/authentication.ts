import { ForbiddenError } from '../core/Error';
import express from 'express';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../database/repository/UserRepo';
import { AuthFailureError, AccessTokenError, TokenExpiredError } from '../core/Error';
import JWT from '../core/JWT';
import KeystoreRepo from '../database/repository/KeystoreRepo';
import { Types } from 'mongoose';
import { getAccessToken, validateTokenData } from './utils';
import validator, { ValidationSource } from '../middlewares/validator';
import schema from './schema';
import asyncHandler from '../middlewares/asyncHandler';
import i18next from 'i18next';


const router = express.Router();


export const Authentification = async (accessToken: string | undefined) => {

  // Express headers are auto converted to lowercase
  // but we need it for socket requests
  accessToken = getAccessToken(accessToken);
  try {
    const payload = await JWT.validate(accessToken);
    validateTokenData(payload);

    const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
    if (!user) throw new AuthFailureError(i18next.t("userNotRegistered"));

    const keystore = await KeystoreRepo.findforKey(user, payload.prm);
    if (!keystore) throw new AuthFailureError(i18next.t("invalidAccessToken"));

    return { user, keystore, accessToken };

  } catch (e) {
    if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
    throw e;
  }
}


export default router.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: ProtectedRequest, res: Response, next: Function) => {

    try {
      const { user, keystore, accessToken } = await Authentification(req.headers.authorization)
      if (!user.enabled) throw new ForbiddenError(req.t("disabledAccount"));

      req.user = user;
      req.keystore = keystore;
      req.accessToken = accessToken;

      return next();

    } catch (e) { throw e }
  }),
);

