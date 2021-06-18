import { Identity } from './Identity'
import { ec } from 'elliptic'
import HDKey from 'hdkey'
import {
  getBitcloutPublicKeyFromKeypair,
  getEcKeypairFromPrivateSeedKey,
  getKeychainFromMnemonic,
  signJWT,
  signTransactionHex,
} from './crypto'

/**
 * Implements methods for signing transactions from a single BitClout account private key
 */
export class SeedAccount extends Identity {
  /** Account's secp256k1 keypair, derived from seed */
  private keypair: ec.KeyPair

  private keychain: HDKey

  /**
   * Construct a bitclout identity from a seed phrase
   * @param mnemonic The seed phrase
   * @param net Which bitclout network to derive the public key for
   */
  constructor(mnemonic: string, net: 'mainnet' | 'testnet' = 'mainnet') {
    const keychain = getKeychainFromMnemonic(mnemonic)
    const keypair = getEcKeypairFromPrivateSeedKey(keychain.privateKey)
    super(getBitcloutPublicKeyFromKeypair(keypair, net))
    this.keypair = keypair
    this.keychain = keychain
  }

  /**
   * Signs a transaction hex
   * @returns The signed transaction hex
   */
  public async signTransaction(transactionHex: string) {
    return signTransactionHex(transactionHex, this.keypair)
  }

  // TODO write utility to verify JWTs
  /**
   * Generates a signed JWT that can be used to authenticate this user to the backend, or other applications.
   */
  public async signJWT() {
    return signJWT(this.keychain.privateKey.toString('hex'), {})
  }
}
