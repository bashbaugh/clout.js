export * from './SeedAccount'
export * from './WebAccount'

interface IIndentity {
  readonly bitcloutPublicKey: string
  readonly canSign: boolean
}

export abstract class Identity implements IIndentity {
  /** Public key shown on account's bitclout profile */
  public readonly bitcloutPublicKey: string

  public readonly canSign = true

  constructor (publicKey: string) {
    this.bitcloutPublicKey = publicKey
  }

  abstract signTransaction (transactionHex: string): Promise<string>
}

/**
 * An identity object for anonymous access to an account.
 * Doesn't have transaction signing capabilities.
 */
export class ReadonlyIdentity implements IIndentity {
  /** Public key shown on account's bitclout profile */
  public readonly bitcloutPublicKey: string

  public readonly canSign = false

  /**
   * Creates a readonly identity
   * @param publicKey A BitClout public key to associate with this identity.
   */
  constructor (publicKey: string) {
    this.bitcloutPublicKey = publicKey
  }
}
