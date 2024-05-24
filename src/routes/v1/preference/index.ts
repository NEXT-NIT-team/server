import express from 'express';
import { SuccessResponse } from '../../../core/Response';
import { ProtectedRequest } from 'app-request';
import validator, { ValidationSource } from '../../../middlewares/validator';
import schema from './schema';
import asyncHandler from '../../../middlewares/asyncHandler';
import PreferenceRepo from '../../../database/repository/PreferenceRepo';
import { default_preference } from '../../../database/model/Preference';
import { InternalError } from '../../../core/Error';
import authentication from '../../../auth/authentication';



const router = express.Router();

// @private
router.use('/', authentication);

/**
 * @POST update
 * @param update
 * @returns Preference
 * */


router.post(
  '/update',
  validator(schema.update),
  asyncHandler(async (req: ProtectedRequest, res: any) => {
    if (!req.user.preference) throw new InternalError();
    delete req.body.user;

    const preference = { ...req.user.preference, ...req.body };
    await PreferenceRepo.update(preference);

    new SuccessResponse('updated', {}).send(res);
  }),
);


/**
 * @GET get preference
 * @returns SuccessResponse()
 * */


router.get(
  '/',
  validator(schema.identifier, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res: any) => {

    if (!req.user.preference) throw new InternalError();
    new SuccessResponse('retreived', req.user.preference).send(res);
  }),
);


/**
 * @GET reset preference
 * @returns SuccessResponse()
 * */


router.get(
  '/reset',
  validator(schema.identifier, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res: any) => {

    if (!req.user.preference) throw new InternalError();

    const reset = { ...req.user.preference, ...default_preference };
    await PreferenceRepo.update(reset);

    new SuccessResponse('reset', reset).send(res);
  }),
);



export default router;