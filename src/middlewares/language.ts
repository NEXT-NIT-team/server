import express from 'express';
import { PublicRequest } from 'app-request';
import asyncHandler from './asyncHandler';
import i18next from 'i18next';

const router = express.Router();

export default router.use(
  asyncHandler(async (req: PublicRequest, res: any, next: Function) => {

    req.clientLanguage = req.headers['accept-language'] || 'fr';
    
    req.i18n.changeLanguage(req.clientLanguage)
    i18next.changeLanguage(req.clientLanguage)
    
    return next();
  }),
);

