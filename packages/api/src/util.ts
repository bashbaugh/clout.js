import { BaseClient } from './BaseClient'
import { NotAuthenticatedError } from './errors'
import { Identity, ReadonlyIdentity } from './identity'

/** Make sure this class is a valid Identity or ReadonlyIdentity */
export function isIdentityInstance(
  obj: any
): obj is Identity | ReadonlyIdentity {
  // return (obj?.identity instanceof WebAccount
  // || obj?.identity instanceof SeedAccount
  // || obj?.identity instanceof ReadonlyIdentity)
  return (
    typeof obj === 'object' &&
    ((obj.canSign === true &&
      Object.prototype.hasOwnProperty.call(obj, 'signTransaction')) ||
      obj.canSign === false) &&
    typeof obj.bitcloutPublicKey === 'string'
  )
}

/** Decorator to throw an error if endpoint is called without an identity */
export function requireSignature(): MethodDecorator {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalFunc = descriptor.value

    descriptor.value = function (this: BaseClient, ...args: any[]) {
      if (!this.identity?.canSign)
        throw new NotAuthenticatedError(key as string)
      else return (originalFunc as (...args: any[]) => any).apply(this, args)
    }

    return descriptor
  }
}
