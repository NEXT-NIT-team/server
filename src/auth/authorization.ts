import express from 'express';
import { ProtectedRequest } from 'app-request';
import { AuthFailureError } from '../core/Error';
import RoleRepo from '../database/repository/RoleRepo';
import asyncHandler from '../middlewares/asyncHandler';

const router = express.Router();


export default router.use(
  asyncHandler(async (req: ProtectedRequest, res: Response, next: Function) => {
    
    if (!req.user || !req.user.role || !req.currentRoleCode)
      throw new AuthFailureError(req.t("permissionDenied"));

    const role = await RoleRepo.findByCode(req.currentRoleCode);

    if (!role) throw new AuthFailureError(req.t("permissionDenied"));
    
    const validRole = req.user.role.toLowerCase() === req.currentRoleCode.toLowerCase();
    
    if (!validRole) throw new AuthFailureError(req.t("permissionDenied"));

    return next();
  }),
);
