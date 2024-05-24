import express, { Response } from 'express';
import schema from './schema';
import asyncHandler from '../../../middlewares/asyncHandler';
import authentication from '../../../auth/authentication';
import upload from '../../../middlewares/uploadHandler';
import UserRepo from '../../../database/repository/UserRepo';
import AttachmentRepo from '../../../database/repository/AttachmentRepo';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import Expo from 'expo-server-sdk';
import bcrypt from 'bcrypt';
import role from '../../../middlewares/role';
import authorization from '../../../auth/authorization';
import { Types } from 'mongoose';
import { RoleCode } from '../../../database/model/Role';
import { AttachmentAs } from '../../../database/model/Attachment';
import { AlreadyExistsError, AuthFailureError, BadRequestError, ForbiddenError, NotFoundError } from '../../../core/Error';
import { SuccessMsgResponse, SuccessResponse } from '../../../core/Response';
import { ProtectedRequest } from 'app-request';
import validator, { ValidationSource } from '../../../middlewares/validator';
import User, { UserModel } from '../../../../src/database/model/User';
import { forbidden } from '@hapi/joi';
import ClientRepo from '../../../database/repository/ClientRepo';
import DoctorRepo from '../../../database/repository/DoctorRepo'
import uploadHandler from '../../../middlewares/uploadHandler';



const router = express.Router();

// @private
router.use('/', authentication);
// @restricted to doctors
router.use('/d', authentication, role(RoleCode.DOCTOR), authorization);


const classMapping: { [key: string]: any } = {
  Client: ClientRepo,
  Doctor: DoctorRepo
};

/**
 * @GET user information
 * @returns User object 
 * */


router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res: any) => {
    const { password, ...user } = req.user;


    const instance = classMapping[user.role]
    user.details = await instance.findById(user.details._id)

    new SuccessResponse('retrieved', user).send(res);
  }),
);


/**
 * @POST update phone number
 * @param phone 
 * @returns User object 
 * */



router.post(
  '/update/phone',
  validator(schema.phone),
  asyncHandler(async (req: ProtectedRequest, res: any) => {
    const { tel, code } = req.body;

    const to = Number(tel);
    if (to == req.user.tel) throw new BadRequestError(req.t("cantUsePhone"));

    let exists = await UserRepo.findByPhone(tel);
    if (exists) throw new AlreadyExistsError('Phone number already used.');

    await UserRepo.update({ ...req.user, tel } as User);
    new SuccessResponse('success', tel).send(res);
  }),
);



/**
 * @POST update user image
 * @param avatar
 * @returns User object
 * */


router.post(
  '/update/avatar',
  upload.single('attachment'),
  asyncHandler(async (req: ProtectedRequest, res: any) => {

    if (req.file) {
      const oldPicture = req.user.picture;

      req.user.picture = (await AttachmentRepo.upload(
        [req.file],
        req.user,
        AttachmentAs.AVATAR))[0];

      if (oldPicture)
        await AttachmentRepo.remove(oldPicture._id as any);

    }

    await UserRepo.update(req.user);
    new SuccessResponse('updated', {}).send(res);
  }),
);


/**
 * @GET user information
 * @returns User object 
 * */


router.get(
  '/:id',
  asyncHandler(async (req: ProtectedRequest, res: any) => {

    const id = new Types.ObjectId(req.params.id)

    const user = await UserRepo.findById(id);
    if (!user) throw new NotFoundError(req.t("userNotFound"));

    new SuccessResponse('retrieved', user).send(res);
  }),
);

/**
 * @DELETE logout
 * @returns SuccessMsgResponse()
 * */


router.delete(
  '/logout',
  asyncHandler(async (req: ProtectedRequest, res: any) => {
    await KeystoreRepo.remove(req.keystore._id);
    new SuccessMsgResponse('Logout success').send(res);
  }),
);

/**
 * @PUT update user data
 * @returns SuccessResponse()
 */

router.put('/update',
  uploadHandler.single("picture"),
  validator(schema.update),
  asyncHandler(async (req: ProtectedRequest, res: any) => {

    const match = await bcrypt.compare(req.body.password, req.user.password);

    if (!match) throw new AuthFailureError(req.t('invalidCredentials'));

    if (req.file) {
      req.body.picture = (await AttachmentRepo.upload(
        [req.file],
        req.user,
        AttachmentAs.AVATAR))[0];

      if (req.user.picture)
        await AttachmentRepo.remove(req.user.picture?._id as any);
    }

    console.log(req.body);

    req.body.name = `${req.body.firstname} ${req.body.lastname}`
    

    delete req.body.password;

    await UserRepo.update({ ...req.user, ...req.body });
    new SuccessMsgResponse("edited").send(res);
  })
)



export default router;
