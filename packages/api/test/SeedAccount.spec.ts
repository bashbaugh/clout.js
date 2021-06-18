import { expect } from 'chai'
import { SeedAccount } from '../src'

// This is a real account (on mainnet)
// Feel free to send bitclout to it I'm sure no one will steal it.
const testAccountSeed =
  'outside seven reunion sniff mimic skull pulp twist twice elegant replace luggage'
const testAccountPublickey =
  'BC1YLhv73xX4vYcXGiCoinNMEfYE6zwX4BGn54vtdFr9RprYcAvpiB2'

const testAccountPublicKeyTestnet =
  'tBCKX3M58o2LeXT1cn8Apxb34rFVKTHzG1qznbpNGDxUmmW3F2iise'

describe('SeedAccount', () => {
  describe('constructor', () => {
    it('should correctly derive the public key for mainnet and testnet', () => {
      const i = new SeedAccount(testAccountSeed, 'mainnet')
      expect(i.bitcloutPublicKey).to.equal(testAccountPublickey)

      const it = new SeedAccount(testAccountSeed, 'testnet')
      expect(it.bitcloutPublicKey).to.equal(testAccountPublicKeyTestnet)
    })
  })
})
