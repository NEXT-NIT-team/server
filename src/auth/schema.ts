import Joi from '@hapi/joi';
import { JoiAuthBearer } from '../middlewares/validator';
import i18next from 'i18next';

export default {
  apiKey: Joi.object()
    .keys({
      'x-api-key': Joi.string().required(),
    })
    .unknown(true),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
};
