import { expect } from 'chai'
import { JWTValidationError, SeedAccount } from '../src'
import {
  decodeBitcloutPublicKey,
  getBitcloutPublicKeyFromKeypair,
  getKeypairFromMnemonic,
  validateJWT,
} from '../src/identity'

const aPhrase =
  'outside seven reunion sniff mimic skull pulp twist twice elegant replace luggage'
const bPhrase =
  'source wink idea genuine upper better wood fault solve reform doll gown'

const a = new SeedAccount(aPhrase)
const b = new SeedAccount(bPhrase)

const aKeypair = getKeypairFromMnemonic(aPhrase)

describe('Crypto:', () => {
  describe('decodeBitcloutPublicKey', () => {
    it('should invert getBitcloutPublicKey', () => {
      const bcltKey = getBitcloutPublicKeyFromKeypair(aKeypair, 'mainnet')
      const newKeypair = decodeBitcloutPublicKey(bcltKey)
      expect(aKeypair.getPublic('hex')).to.equal(newKeypair.getPublic('hex'))
    })
  })

  describe('validateJWT', async () => {
    const aJWT = await a.signJWT()

    it('should correctly validate a JWT', () => {
      expect(validateJWT(aJWT, a.bitcloutPublicKey).iat).be.a('number')
    })

    it('should throw a JWTValidationError', () => {
      expect(() => validateJWT(aJWT, b.bitcloutPublicKey)).to.throw(
        'Unable to decode or verify JWT'
      )
    })
  })
})
