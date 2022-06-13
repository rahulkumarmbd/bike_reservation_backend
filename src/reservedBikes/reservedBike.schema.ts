import * as joi from 'joi';

export const reservationSchema = joi.object({
  bookingDate: joi.date().empty().error(new Error('new Error')).required(),
  returnDate: joi.date().empty().error(new Error('new Error')).required(),
  bikeId: joi.number().empty().error(new Error()).required(),
});
