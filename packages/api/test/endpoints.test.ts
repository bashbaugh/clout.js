import { resolve } from 'path'
require('dotenv').config({ path: resolve(__dirname, '../.env') })
import { expect } from 'chai'
import { BitcloutClient, ReadonlyIdentity, SeedAccount } from '../src'

// TODO figure out how to generate a schema by reflecting return types and validate responses against actual types

const anonClient = new BitcloutClient()
// const readonlyClient = new BitcloutClient()

const fakeHashHexh =
  '9fcd2c948c04ea689b76f22db52dcc7161415be15da1d4759c8ee8ee5352ae16'

// TODO figure out how to test endpoints which need signature
// TODO write endpoint tests

describe('General endpoints:', () => {
  describe('healthCheck', () => {
    it('is ok', async () => {
      const { ok } = await anonClient.healthCheck()
      expect(ok).true
    })
  })

  describe('getExhangeRate', () => {
    it('is ok', async () => {
      const res = await anonClient.getExchangeRate()
      const usdExchangeRate =
        (((1 * res.SatoshisPerBitCloutExchangeRate) / 1e8) *
          res.USDCentsPerBitcoinExchangeRate) /
        100
      expect(res.USDPerBitCloutExchangeRate).to.equal(usdExchangeRate)
      expect(res.NanosSold).to.be.a('number')
    })
  })

  describe('getAppState', () => {
    it('is ok', async () => {
      const res = await anonClient.getAppState()
      expect(res.CreateProfileFeeNanos).a('number')
      expect(res.DiamondLevelMap[1]).a('number')
    })
  })
})

describe('Transaction endpoints:', () => {
  describe('checkTransaction', () => {
    it('is ok', async () => {
      const { TxnFound } = await anonClient.checkTransaction(fakeHashHexh)
      expect(TxnFound).false
      // TODO check valid transaction
    })
  })
})

describe('Media endpoints:', () => {
  describe('uploadImage', () => {
    it('is ok', async () => {
      // const { TxnFound } = await anonClient.checkTransaction(fakeHashHexh)
      // expect(TxnFound).false
      // TODO check valid transaction
    })
  })
})
