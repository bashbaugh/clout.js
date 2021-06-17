
export * from './BitcloutClient'
export { ClientConfig } from './BaseClient'
export { 
  Identity, 
  WebAccount, 
  SeedAccount, 
  ReadonlyIdentity, 
  BitcloutAuthData, 
  LoginReturnType 
} from './identity'
export * from './errors'
export * from './types'

/** Convert an amount of nanos to bitclout by dividing by 1e9 */
export const nanosToBitclout = (n: number) => n / 1e9


/** Convert an amount of bitclout to bitclout nanos by multiplying by 1e9 */
export const bitcloutToNanos = (n: number) => n * 1e9
