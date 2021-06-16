export * from './SeedAccount'
export * from './WebAccount'

export abstract class Identity {
  /** Public key shown on account's bitclout profile */
  public readonly bitcloutPublicKey: string

  constructor (publicKey: string) {
    this.bitcloutPublicKey = publicKey
  }

  abstract signTransaction (transactionHex: string): Promise<string>
}
