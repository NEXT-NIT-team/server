import Joi from '@hapi/joi';
import { GoogleURI, JoiAuthBearer, JoiObjectId, PhoneNumber } from '../../../middlewares/validator';
import { RoleCode } from '../../../database/model/Role';
import i18next from 'i18next';

export default {
  login: Joi.object().keys({
    password: Joi.string().required().min(6),
    email: Joi.string().email().required()
  }),

  phone: Joi.object().keys({
    tel: PhoneNumber().required()
  }),

  email: Joi.object().keys({
    email: Joi.string().email().required(),
  }),

  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),

  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),

  signup: Joi.object().keys({
    firstname: Joi.string().required().min(3),
    lastname: Joi.string().required().min(3),
    tel: PhoneNumber().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid(...Object.values(RoleCode)).required(),
    details: Joi.alternatives().conditional(
      Joi.ref('role'),
      {
        switch: [
          // client-specific details
          {
            is: RoleCode.CLIENT,
            then: Joi.object().keys({
              isMale: Joi.boolean().required().default(true)
            })
          },
          // restaurant-specific details
          {
            is: RoleCode.DOCTOR,
            then: Joi.object().keys({
              
            })
          },
        ],
        otherwise: Joi.forbidden()
      }
    )
  }),

  token: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().optional().length(4),
    password: Joi.string().optional().min(6)
  }),
};


