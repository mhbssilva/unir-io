import { classToPlain } from 'class-transformer';
import * as _ from 'lodash';

export function classToObject<T>(notification: T) {
  return classToPlain<T>(notification);
}

export function objectToClass<T>(
  Model: new (...args: any[]) => T,
  item: object
) {
  const modelInstance = Object.create(Model.prototype);
  return Object.assign(modelInstance, item) as T;
}

export function removeEmptyAttrs(obj: object) {
  return _.pickBy(obj, _.identity);
}
