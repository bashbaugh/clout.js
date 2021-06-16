
export * from './BitcloutClient'
export { ClientConfig } from './BaseClient'
export * from './types'
export { WebAccount, SeedAccount } from './identity'
export * from './errors'

/** Convert an amount of nanos to bitclout by dividing by 1e9 */
export const nanosToBitclout = (n: number) => n / 1e9


/** Convert an amount of bitclout to bitclout nanos by multiplying by 1e9 */
export const bitcloutToNanos = (n: number) => n * 1e9
