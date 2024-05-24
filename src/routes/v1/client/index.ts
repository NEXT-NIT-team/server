import express from 'express';
import authentication from '../../../auth/authentication';
import verification from '../../../auth/verification';
import asyncHandler from '../../../middlewares/asyncHandler';
import { ProtectedRequest } from 'app-request';
import ClientRepo from '../../../database/repository/ClientRepo';
import { NoDataError } from '../../../core/Error';
import { SuccessMsgResponse } from '../../../core/Response';
import validator from '../../../middlewares/validator';
import schema from './schema';

const router = express.Router();

// @private
router.use('/', authentication, verification);


export default router