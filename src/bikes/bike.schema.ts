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
  avgRating: joi.number().empty().error(new Error("Average rating can't be empty")),
  reserved: joi.boolean().empty().error(new Error("Reserved field can't be empty and it should be boolean")),
  id: joi.number(),
});

