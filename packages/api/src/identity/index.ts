import { ec } from 'elliptic'
import { getBitcloutPublicKeyFromKeypair, getKeypairFromMnemonic, signTransactionHex } from './crypto'

export default class Account {
  /** Account's secp256k1 keypair, derived from seed */
  private keypair: ec.KeyPair

  /** Public key shown on account's bitclout profile */
  public readonly bitcloutPublicKey: string

  constructor (mnemonic: string, net: 'mainnet' | 'testnet' = 'mainnet') {
    this.keypair = getKeypairFromMnemonic(mnemonic)
    this.bitcloutPublicKey = getBitcloutPublicKeyFromKeypair(this.keypair, net)
  }

  public signTransaction (transactionHex: string) {
    return signTransactionHex(transactionHex, this.keypair)
  }
}
