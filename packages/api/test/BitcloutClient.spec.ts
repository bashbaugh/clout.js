import { expect } from 'chai'
import { BitcloutClient, ReadonlyIdentity, SeedAccount } from '../src'

// This is a real account.
// Feel free to send bitclout to it I'm sure no one will steal it.
const testAccountSeed =
  'outside seven reunion sniff mimic skull pulp twist twice elegant replace luggage'
const testAccountPublickey =
  'BC1YLhv73xX4vYcXGiCoinNMEfYE6zwX4BGn54vtdFr9RprYcAvpiB2'

describe('BitcloutClient', () => {
  describe('constructor', () => {
    it('should create a ReaonlyIdentity', () => {
      const client = new BitcloutClient(testAccountPublickey)
      expect(client.identity).to.be.instanceOf(ReadonlyIdentity)
    })

    it('should create a SeedAccount', () => {
      const client = new BitcloutClient(testAccountSeed)
      expect(client.identity).to.be.instanceOf(SeedAccount)
      expect(client.identity?.bitcloutPublicKey).to.equal(testAccountPublickey)
    })
  })
})
