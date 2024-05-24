import Joi from '@hapi/joi';
import { JoiObjectId, PhoneNumber } from '../../../middlewares/validator';
import { RoleCode } from '../../../database/model/Role';


export default {
  phone: Joi.object().keys({
    tel: PhoneNumber().required(),
    code: Joi.string().required().length(4),
  }),
  email: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().required().length(4),
  }),
  device: Joi.object().keys({
    isDevice: Joi.boolean().required(),
    manufacturer: Joi.string().required(),
    modelName: Joi.string().required(),
    osVersion: Joi.string().required(),
    deviceName: Joi.string().required(),
    expoPushToken: Joi.string().optional(),
  }),
  update: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().required().min(6),
    tel: PhoneNumber().required()
  }),
  state: Joi.object().keys({
    _id: JoiObjectId().required(),
    verified: Joi.boolean().required(),
    enabled: Joi.boolean().required()
  }),
  identifier: Joi.object().keys({
    id: JoiObjectId().required()
  }),
  activity: Joi.object().keys({
    isActive: Joi.bool().required()
  }),
  role: Joi.object().keys({
    role: Joi.string().valid(RoleCode.DOCTOR, RoleCode.CLIENT).required()
  })
};
