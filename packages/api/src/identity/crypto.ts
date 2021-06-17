import HDKey from 'hdkey'
import * as bip39 from 'bip39'
import { ec as EC } from 'elliptic'
import sha256 from 'sha256'
import bs58check from 'bs58check'

// TODO make async???
// TODO signing system may change at any time; need to keep an eye on official repo for changes
// https://github.com/bitclout/identity/

// https://github.com/bitclout/identity/blob/main/src/app/crypto.service.ts#L22
const BCLT_PUBLIC_KEY_PREFIXES = {
  mainnet: [0xcd, 0x14, 0x0],
  testnet: [0x11, 0xc2, 0x0]
}

export function getKeychainFromMnemonic(mnemonic: string): HDKey {
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  return HDKey.fromMasterSeed(seed).derive('m/44\'/0\'/0\'/0/0')
}

export function getEcKeypairFromPrivateSeedKey(seed: Buffer | string) {
  const ec = new EC('secp256k1')
  return ec.keyFromPrivate(seed)
}

export const getKeypairFromMnemonic = (mnemonic: string) => 
  getEcKeypairFromPrivateSeedKey(getKeychainFromMnemonic(mnemonic).privateKey)

// https://github.com/bitclout/identity/blob/main/src/lib/bindata/util.ts
function uvarint64ToBuf (uint: number): Buffer {
  const result = []
  while (uint >= 0x80) {
    // @ts-ignore
    result.push((uint & 0xFF) | 0x80); uint >>>= 7;
  }
  // @ts-ignore
  result.push(uint | 0)
  return Buffer.from(result)
}

export function getBitcloutPublicKeyFromKeypair(keypair: EC.KeyPair, net: 'mainnet' | 'testnet'): string {
  const prefix = BCLT_PUBLIC_KEY_PREFIXES[net]
  const key = keypair.getPublic().encode('array', true)
  const prefixAndKey = Uint8Array.from(prefix.concat(key))
  return bs58check.encode(prefixAndKey)
}

export function signTransactionHex(txn: string, keypair: EC.KeyPair) {
  const transactionBytes = Buffer.from(txn, 'hex')
  const transactionHash = Buffer.from(sha256.x2(transactionBytes), 'hex')
  const signature = keypair.sign(transactionHash)
  const signatureBytes = Buffer.from(signature.toDER())
  const signatureLength = uvarint64ToBuf(signatureBytes.length)

  const signedTransactionBytes = Buffer.concat([
    // From bitclout github:
    // This slice is bad. We need to remove the existing signature length field prior to appending the new one.
    // Once we have frontend transaction construction we won't need to do this.
    transactionBytes.slice(0, -1),
    signatureLength,
    signatureBytes,
  ])

  return signedTransactionBytes.toString('hex')
}
