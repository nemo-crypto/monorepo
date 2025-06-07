import Schema from 'async-validator';
import { isFunction } from './types';

export const validate = (value = '', schema = {}, callback, options = {}, ) => {
  let validator = new Schema(schema);
  if (isFunction(callback)) {
    validator.validate(value, options, callback);
  } else {
    validator.validate(value, options, defaultCallback);
  }
}

const defaultCallback = (errors, fields) => {
  let msgs = errors.map(err => err.message).join()
  throw new Error(`data type invalid: ${msgs} \n`);
};

