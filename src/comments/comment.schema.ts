import * as joi from 'joi';
export const createCommentSchema = joi.object({
  comment: joi.string().empty().error(new Error("comment can't be empty")),
  userName: joi.string().empty().error(new Error("User name can't be empty")),
  time: joi
    .date()
    .min(new Date().toISOString())
    .empty()
    .error(new Error("date can't be empty")),
  model: joi.string().empty().error(new Error("model can't be empty")),
  rating: joi.string().empty().error(new Error("rating can't be empty")),
  reservation: joi
    .number()
    .empty()
    .error(new Error("reservation can't be empty")),
  id: joi.string().empty().error(new Error("id can't be empty")),
  page: joi.string().empty().error(new Error("id can't be empty")),
  limit: joi.string().empty().error(new Error("id can't be empty")),
});
