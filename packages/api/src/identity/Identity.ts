interface IIndentity {
  readonly bitcloutPublicKey: string
  readonly canSign: boolean
}

/**
 * If you need to integrate a custom identity system or signing functionality,
 * you can extend this class (or {@link ReadonlyIdentity}).
 */
export abstract class Identity implements IIndentity {
  /** Public key shown on account's bitclout profile */
  public readonly bitcloutPublicKey: string

  public readonly canSign = true

  constructor(publicKey: string) {
    if (this.constructor === Identity) {
      throw Error(
        'Cannot directly instantiate an abstract Identity class. Use a WebAccount or SeedAccount instead.'
      )
    }

    this.bitcloutPublicKey = publicKey
  }

  /** Must take an unsigned transaction hex and return a signed hex that can be submitted to BitClout. */
  abstract signTransaction(transactionHex: string): Promise<string>

  /** Must sign and return an empty JWT using the account's private key */
  abstract signJWT(): Promise<string>
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
  constructor(publicKey: string) {
    this.bitcloutPublicKey = publicKey
  }
}
