import * as joi from 'joi';

export const reservationSchema = joi.object({
  bookingDate: joi.date().empty().error(new Error('new Error')).required(),
  returnDate: joi.date().empty().error(new Error('new Error')).required(),
  bikeId: joi.number().empty().error(new Error()).required(),
});

export const paginationSchema = joi.object({
  limit: joi.string().empty().error(new Error('Limit is required')).required(),
  page: joi
    .string()
    .empty()
    .error(new Error('page parameter is required'))
    .required(),
});

export const idAndPaginationSchema = joi.object({
  limit: joi.string().empty().error(new Error('Limit is required')),
  page: joi.string().empty().error(new Error('page parameter is required')),
  id: joi.string().empty().error(new Error('id is required')),
});

export const idSchema = joi.object({
  id: joi.string().empty().error(new Error('id is required')).required(),
});
