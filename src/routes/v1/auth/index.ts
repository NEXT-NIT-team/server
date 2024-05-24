import {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  BadTokenError,
  AlreadyExistsError,
  NotFoundError,
} from '../../../core/Error';
import express, { Request, Response, NextFunction } from 'express';
import { SuccessResponse, TokenRefreshResponse } from '../../../core/Response';
import { ProtectedRequest, RoleRequest, PublicRequest } from 'app-request';
import validator, { ValidationSource } from '../../../middlewares/validator';
import schema from './schema';
import asyncHandler from '../../../middlewares/asyncHandler';
import { Types } from 'mongoose';
import User from '../../../database/model/User';
import UserRepo from '../../../database/repository/UserRepo';
import { createTokens, getAccessToken, validateTokenData } from '../../../auth/utils';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import JWT from '../../../core/JWT';
import PreferenceRepo from '../../../database/repository/PreferenceRepo';
import { default_preference } from '../../../database/model/Preference';
import ClientRepo from '../../../database/repository/ClientRepo';
import DoctorRepo from '../../../database/repository/DoctorRepo'
import { RoleCode } from '../../../database/model/Role';
import AttachmentRepo from '../../../database/repository/AttachmentRepo';

const router = express.Router();

/**
 * Dynamic class by role code
 * @returns role class
 * */

const classMapping: { [key: string]: any } = {
  Client: ClientRepo,
  Doctor: DoctorRepo
};

/**
 * @GET logout
 * @returns server status
 * */

router.get(
  '/status',
  asyncHandler(async (req: PublicRequest, res: any) => {
    new SuccessResponse('Running', { status: 200 }).send(res);
  }),
);

/**
 * @POST signup
 * @param signup
 * @returns User object
 * */

router.post(
  '/signup',
  validator(schema.signup),
  //SignupLimiter,
  asyncHandler(async (req: PublicRequest, res: Response, next: NextFunction) => {
    const user: User | any = req.body;
    user.role = req.role;

    // is already signed up
    const phone = await UserRepo.findByPhone(user.tel);
    const email = await UserRepo.findByEmail(user.email, req.role);

    
    if (email) throw new AlreadyExistsError(req.t('EmailAlreadyUsed'));
    if (phone) throw new AlreadyExistsError(req.t('PhoneNumberAlreadyUsed'));

    const instance = classMapping[user.role];

    // create row according to role
    let details = await instance.create(user.details);

    // create user
    const { user: createdUser, keystore } = await UserRepo.create({ ...user, details }, user.role);

    // set default preference
    createdUser.preference = await PreferenceRepo.create({
      user: createdUser,
      ...default_preference,
    } as any);

    console.log(keystore);
    

    // update user
    await UserRepo.update(createdUser as User);
    const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);

    // fetch user
    const user_: any = await UserRepo.findByPhone(user.tel);
    if (user_) delete user_.password;

    new SuccessResponse('Signup Successful', {
      user: user_,
      tokens,
    }).send(res);
  }),
);

/**
 * @POST login
 * @param credentials
 * @returns User object
 * */

import i18nextMiddleware from 'i18next-http-middleware';

router.post(
  '/login',
  validator(schema.login),
  //AuthLimiter,
  asyncHandler(async (req: PublicRequest, res: any) => {
    // find
    const user: User | any = await UserRepo.findByEmail(req.body.email, req.role);

    if (!user) throw new AuthFailureError(req.t('invalidCredentials'));

    // compare
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError(req.t('invalidCredentials'));
    

    // generate tokens
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    // create tokens
    await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    delete user.password;

    new SuccessResponse('Login Success', {
      user,
      tokens,
    }).send(res);
  }),
);

/**
 * @GET phone availability
 * @param phone
 * @returns SuccessResponse()
 * */

router.get(
  '/exists/phone/:tel',
  validator(schema.phone, ValidationSource.PARAM),
  asyncHandler(async (req: PublicRequest, res: any) => {
    const to = parseInt(req.params.tel);

    // find user
    const user = await UserRepo.findByPhone(to);
    new SuccessResponse('success', { exists: !!user }).send(res);
  }),
);

/**
 * @GET email availability
 * @param email
 * @returns SuccessResponse()
 * */

router.get(
  '/exists/:email',
  asyncHandler(async (req: PublicRequest, res: any) => {
    const user = await UserRepo.findByEmail(req.params.email, req.role);

    new SuccessResponse('success', { exists: !!user }).send(res);
  }),
);


/**
 * @POST refresh user token
 * @param refresh
 * @returns SuccessResponse()
 * */

router.post(
  '/refresh',
  validator(schema.auth, ValidationSource.HEADER),
  validator(schema.refreshToken),
  asyncHandler(async (req: ProtectedRequest, res: any) => {
    // Express headers are auto converted to lowercase
    req.accessToken = getAccessToken(req.headers.authorization);

    const accessTokenPayload = await JWT.decode(req.accessToken);
    validateTokenData(accessTokenPayload);

    const user = await UserRepo.findById(new Types.ObjectId(accessTokenPayload.sub));
    if (!user) throw new AuthFailureError(req.t('userNotFound'));

    req.user = user;

    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub) throw new BadTokenError();

    const keystore = await KeystoreRepo.find(
      req.user._id,
      accessTokenPayload.prm,
      refreshTokenPayload.prm,
    );

    if (!keystore) throw new BadTokenError();
    await KeystoreRepo.remove(keystore._id);

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(req.user, accessTokenKey, refreshTokenKey);

    new TokenRefreshResponse('Token Issued', tokens.accessToken, tokens.refreshToken).send(res);
  }),
);

export default router;
