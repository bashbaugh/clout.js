import { BaseClient } from './BaseClient'
import { NotAuthenticatedError } from './errors'
import * as api from './types'

/**
 * A BitClout node API client
 * 
 * Example:
 * ```
 * import { Client } from '@cloutjs/api'
 * 
 * const client = new Client('figure various run...', 'https://my-bitclout-node.io')
 * ```
 * @beta
 */
export class BitcloutClient extends BaseClient {
  /**
   * Create a client for a single account and node
   * @param mnemonic The seed phrase of the account
   * @param nodeUrl URL of the BitClout node. This is bitclout.com by default, though it is recommended to host your own node.
   * @param cfg Client configuration
   */
  constructor (...args: ConstructorParameters<typeof BaseClient>) {
    super(...args)
  }

  /* Endpoints */

  /**
   * Checks the sync status of the node. Throws an error if check is not succesful.
   * @returns `ok: true` if the node is running and synced, otherwise throws an error.
   */
  public async healthCheck (): Promise<{ ok: true }> {
    await this.callApi('health-check', {}, 'GET')
    // If the request was succesful, that means the check succeeded.
    return {
      ok: true
    }
  }

  /** Gets the current exchange rate */
  public async getExchangeRate() {
    const res = await this.callApi<api.GetExchangeRateResponse>('get-exchange-rate', {}, 'GET')
    return res
  } 

  /** Submit a post */
  public async submitPost(
    /** Post body text */
    body: string
  ) {
    if (!this.identity) throw new NotAuthenticatedError('submitPost')
    return this.handleTransactionRequest<api.PostSubmissionResponse>('submit-post', {
      UpdaterPublicKeyBase58Check: this.identity.bitcloutPublicKey,
      BodyObj: {
        Body: body
      },
      IsHidden: false,
      MinFeeRateNanosPerKB: 1000
    })
  }
}
