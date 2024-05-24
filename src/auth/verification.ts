import { ForbiddenError, UnverifiedError } from '../core/Error';
import express from 'express';
import { ProtectedRequest } from 'app-request';
import validator, { ValidationSource } from '../middlewares/validator';
import schema from './schema';
import asyncHandler from '../middlewares/asyncHandler';

const router = express.Router();

export default router.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: ProtectedRequest, res: Response, next: Function) => {

    try {
      if (!req.user.verified) throw new UnverifiedError(req.t("unverifiedUser"));
      return next();

    } catch (e) { throw e; }
  }),
);

