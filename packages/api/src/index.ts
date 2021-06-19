export * from './BitcloutClient'
export { ClientConfig } from './BaseClient'
export {
  Identity,
  WebAccount,
  SeedAccount,
  ReadonlyIdentity,
  BitcloutAuthData,
  LoginReturnType,
  validateJWT,
} from './identity'
export * from './errors'
export * from './types'

/** Convert an amount of nanos to bitclout (or creator coins) by dividing by 1e9 */
export const nanosToClout = (n: number) => n / 1e9

/** Convert an amount of bitclout (or creator coins) to nanos by multiplying by 1e9 */
export const cloutToNanos = (n: number) => n * 1e9

/** Convert an amount of satoshis to bitcoin by dividing by 1e8 */
export const satoshisToBitcoin = (n: number) => n / 1e8

/** Convert an amount of bitcoin to satoshis by multiplying by 1e8 */
export const bitcoinToSatoshis = (n: number) => n * 1e8
