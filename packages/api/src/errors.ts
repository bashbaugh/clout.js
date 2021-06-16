
export class NoWindowError extends Error {
  constructor() {
    super(`Couldn't access global window object. Make sure you're only using WebAccount in a browser environment.`)

    this.name = 'NoWindowError'
  }
}

export class NotAuthenticatedError extends Error {
  constructor(endpointCalled: string) {
    super(`${endpointCalled} requires a signature. Please add a SeedAccount or WebAccount to the client.`)

    this.name = 'NotAuthenticatedError'
  }
}
