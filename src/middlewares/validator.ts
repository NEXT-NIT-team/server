import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../core/Error';
import { Types } from 'mongoose';
import i18next from 'i18next';
import { ProtectedRequest } from 'app-request';
import Logger from '../core/Logger';

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}


export const GoogleURI = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.includes('https://www.google.com/maps/place' || value.length > 8192)) return helpers.message({
      custom: 'Please enter a valid google maps url ex: "https://www.google.com/maps/place/...."'
    });
    return value;
  }, 'Google URI Validation');



export const PhoneNumber = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.match(/^(0)?(5|6|7)[0-9]{8}$/)) return helpers.message({
      custom: 'Please enter a valid algerian phone number, should have 9 digits that starts with 5/6/7'
    });
    return value;
  }, 'Phone Number Validation');


export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error('any.invalid');
    return value;
  }, 'Object Id Validation');



export const JoiUrlEndpoint = () =>
  Joi.string().custom((value: string, helpers) => {
    if (value.includes('://')) return helpers.error('any.invalid');
    return value;
  }, 'Url Endpoint Validation');



export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith('Bearer ')) return helpers.error('any.invalid');
    if (!value.split(' ')[1]) return helpers.error('any.invalid');
    return value;
  }, 'Authorization Header Validation');



export default (schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) => (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    
    const { error } = schema.validate(req[source]);
    
    if (!error) return next();
    
    const { details } = error;
    // const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');

    const message: string[] = []
    error.details.forEach(_error => {
      const key : string = _error.context?.key || _error.context?.label || ""
      
      const _message = req.t(_error.type, {key, ..._error.context})
      
      message.push(_message)
    })
    // console.log(error);

    next(new BadRequestError(message[0]));
  } catch (error) {
    next(error);
  }
};
