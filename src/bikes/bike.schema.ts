import * as joi from 'joi';

export const bikeSchema = joi.object({
  model: joi.string().empty().error(new Error('Model is required')).required(),
  color: joi.string().empty().error(new Error('Color is required')).required(),
  location: joi
    .string()
    .empty()
    .error(new Error('Location is required'))
    .required(),
  available: joi
    .boolean()
    .empty()
    .error(new Error('available field is required and it should be boolean'))
    .required(),
});

export const bikePatchSchema = joi.object({
  model: joi.string().empty().error(new Error('Model is required')),
  color: joi.string().empty().error(new Error('Color is required')),
  location: joi.string().empty().error(new Error('Location is required')),
  available: joi
    .boolean()
    .empty()
    .error(new Error('available field is required and it should be boolean')),
  avgRating: joi
    .number()
    .empty()
    .error(new Error("Average rating can't be empty")),
  reserved: joi
    .boolean()
    .empty()
    .error(new Error("Reserved field can't be empty and it should be boolean")),
  id: joi.number(),
});

export const limitAndPageSchema = joi.object({
  limit: joi.string().empty().error(new Error('Limit is required')).required(),
  page: joi
    .string()
    .empty()
    .error(new Error('page parameter is required'))
    .required(),
});

export const nonReservedSchema = joi.object({
  limit: joi
    .string()
    .empty()
    .error(new Error('Limit parameter is required'))
    .required(),
  page: joi
    .string()
    .empty()
    .error(new Error('page parameter is required'))
    .required(),
  bookingDate: joi
    .date()
    .empty()
    .min(new Date().toISOString())
    .error(new Error('bookingDate is required'))
    .required(),
  returnDate: joi
    .date()
    .empty()
    .min(new Date().toISOString())
    .error(new Error('returnDate is required'))
    .required(),
  model: joi.string().allow('').error(new Error('model is invalid')),
  color: joi.string().allow('').error(new Error('color is invalid')),
  avgRating: joi
    .string()
    .allow('')
    .error(new Error('average rating is invalid')),
  location: joi.string().allow('').error(new Error('location is invalid')),
});

export const filterSchema = joi.object({
  limit: joi
    .string()
    .empty()
    .error(new Error('Limit parameter is required'))
    .required(),
  page: joi
    .string()
    .empty()
    .error(new Error('page parameter is required'))
    .required(),
  model: joi.string().allow('').error(new Error('model is invalid')),
  color: joi.string().allow('').error(new Error('color is invalid')),
  avgRating: joi
    .string()
    .allow('')
    .error(new Error('average rating is invalid')),
  location: joi.string().allow('').error(new Error('location is invalid')),
});

export const idSchema = joi.object({
  id: joi.number().error(new Error('Id is required')).required(),
});
