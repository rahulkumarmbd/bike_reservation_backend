import * as joi from 'joi';

export const userSchema = joi.object({
  fullName: joi
    .string()
    .min(3)
    .max(30)
    .error(new Error('full name must be at least 3 characters'))
    .required(),
  email: joi.string().email().error(new Error('Email is Invalid')).required(),
  password: joi
    .string()
    .min(6)
    .error(new Error('password must be at least 6 characters'))
    .required(),
  phoneNumber: joi
    .number()
    .min(999999999)
    .max(99999999999)
    .error(new Error('phone number should be 10 digits'))
    .required(),
  roles: joi
    .string()
    .allow('regular', 'manager')
    .error(new Error('Only two options are allowed i.e regular and manager'))
    .required(),
});

export const userLoginSchema = joi.object({
  email: joi.string().email().error(new Error('Email is Invalid')).required(),
  password: joi
    .string()
    .min(6)
    .error(new Error('password must be at least 6 characters'))
    .required(),
});

export const userPatchSchema = joi.object({
  fullName: joi
    .string()
    .min(3)
    .max(30)
    .error(new Error('full name must contain at least 3 characters')),
  email: joi.string().email().error(new Error('Email is Invalid')),
  password: joi
    .string()
    .min(6)
    .error(new Error('password must contain at least 6 characters')),
  phoneNumber: joi
    .number()
    .min(999999999)
    .max(99999999999)
    .error(new Error('phone number should of 10 digits')),
  roles: joi
    .string()
    .empty()
    .allow('regular')
    .allow('manager')
    .error(
      new Error(
        "roles can't be empty and it's role can be only regular and manager",
      ),
    ),
  id: joi.number(),
});

export const userJwtToken = joi.object({
  token: joi
    .string()
    .empty()
    .error(new Error('Token is required. Please provide a valid token'))
    .required(),
});
