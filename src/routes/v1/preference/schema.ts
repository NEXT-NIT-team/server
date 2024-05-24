import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../middlewares/validator';
import { Language } from '../../../database/model/Preference';


export default {

  update: Joi.object().keys({
    language: Joi.string().valid(...Object.values(Language)).optional(),
    notifications: Joi.boolean().optional(),
    darkMode: Joi.boolean().optional(),
    cigarette: Joi.number().optional().min(0).max(3),
    discussion: Joi.number().optional().min(0).max(3),
    music: Joi.number().optional().min(0).max(3),
    pets: Joi.number().optional().min(0).max(3),
    luggage: Joi.number().optional().min(0).max(3),
  }),

  identifier: Joi.object().keys({
    id: JoiObjectId().required()
  }),
};
