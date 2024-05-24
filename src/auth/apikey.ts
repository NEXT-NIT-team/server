import express from 'express';
import ApiKeyRepo from '../database/repository/ApiKeyRepo';
import { ForbiddenError } from '../core/Error';
import { PublicRequest } from 'app-request';
import schema from './schema';
import validator, { ValidationSource } from '../middlewares/validator';
import asyncHandler from '../middlewares/asyncHandler';

const router = express.Router();

export default router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: PublicRequest, res: any, next: Function) => {

    // @ts-ignore
    req.apiKey = req.headers['x-api-key'].toString();

    const apiKey = await ApiKeyRepo.findByKey(req.apiKey);
    if (!apiKey) throw new ForbiddenError();

    req.role = apiKey.role

    return next();
  }),
);