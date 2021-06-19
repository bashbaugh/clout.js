/**
 * @ignore
 */
export class NoWindowError extends Error {
  constructor() {
    super(
      `Couldn't access global window object. Make sure you're only using WebAccount in a browser environment.`
    )
    this.name = 'NoWindowError'
  }
}

/**
 * @ignore
 */
export class NotAuthenticatedError extends Error {
  constructor(endpointCalled: string) {
    super(
      `${endpointCalled} requires a signature. Please add a SeedAccount or WebAccount to the client.`
    )
    this.name = 'NotAuthenticatedError'
  }
}

/**
 * @ignore
 */
export class SigningError extends Error {
  constructor(msg?: string) {
    super(`Unable to sign transaction hex: ${msg}`)
    this.name = 'SigningError'
  }
}

/**
 * @ignore
 */
export class InvalidConfigError extends Error {
  constructor(msg?: string) {
    super(`${msg}`)
    this.name = 'InvalidConfigError'
  }
}

/**
 * @ignore
 */
 export class JWTValidationError extends Error {
  constructor(msg?: string) {
    super(`${msg}`)
    this.name = 'JWTValidationError'
  }
}
