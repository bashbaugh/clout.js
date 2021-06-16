import { Identity } from '.'
import { ec } from 'elliptic'
import { getBitcloutPublicKeyFromKeypair, getKeypairFromMnemonic, signTransactionHex } from './crypto'

/**
 * Implements methods for signing transactions from a single BitClout account private key
 */
 export class SeedAccount extends Identity {
  /** Account's secp256k1 keypair, derived from seed */
  private keypair: ec.KeyPair

  /**
   * Construct a bitclout identity from a seed phrase
   * @param mnemonic The seed phrase
   * @param net Which bitclout network to derive the public key from
   */
  constructor (mnemonic: string, net: 'mainnet' | 'testnet' = 'mainnet') {
    const keypair = getKeypairFromMnemonic(mnemonic)
    super(getBitcloutPublicKeyFromKeypair(keypair, net))
    this.keypair = keypair
  }

  public async signTransaction (transactionHex: string) {
    return signTransactionHex(transactionHex, this.keypair)
  }
}