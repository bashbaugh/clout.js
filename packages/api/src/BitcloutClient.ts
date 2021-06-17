import { BaseClient, ClientConfig } from './BaseClient'
import { InvalidConfigError, NotAuthenticatedError } from './errors'
import { Identity, ReadonlyIdentity, SeedAccount, WebAccount } from './identity'
import * as api from './types'

function isConfigWithIdentity (obj: any): obj is Partial<ClientConfig> & {
  identity: Identity | ReadonlyIdentity
} {
  return typeof obj === 'object'
  && (obj?.identity instanceof WebAccount 
  || obj?.identity instanceof SeedAccount
  || obj?.identity instanceof ReadonlyIdentity)
}

// Make sure this class is a valid Identity or ReadonlyIdentity
function isIdentityInstance (obj: any): obj is Identity | ReadonlyIdentity {
  // return (obj?.identity instanceof WebAccount 
  // || obj?.identity instanceof SeedAccount
  // || obj?.identity instanceof ReadonlyIdentity)
  return typeof obj === 'object' 
  && ((obj.canSign === true && (obj as object).hasOwnProperty('signTransaction')) || (obj.canSign === false))
  && typeof obj.bitcloutPublicKey === 'string'
}

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
   * Initialize a BitClout node client 
   * @param identityArg
   * This will be the identity used by the client in requests and for signing transactions (optional).
   * 
   * It must be an instance of {@link WebAccount} (for sending requests on behalf of client-side users), 
   * {@link SeedAccount} (for server-side bots **exclusively** - _NEVER ASK A USER FOR THEIR SEED PHRASE_), 
   * {@link ReadonlyIdentity} (which is just a read-only public key and can't sign transactions), or 
   * any custom class that extends {@link Identity}.
   * 
   * You can also supply a 12-word seed phrase mnemonic if you want to automatically generate a {@link SeedAccount}. 
   * Or, pass a bitclout public key to automatically generate a {@link ReadonlyIdentity}. 
   * 
   * Finally, if you pass null or undefined, the client will be created without an identity, but won't be able to access many endpoints.
   * @param nodeURL 
   * URL of the BitClout node (without the final slash). This is bitclout.com by default, though it is recommended to host your own node.
   * @param otherCfg Other configuration for the client
   */
  constructor (
    identityArg?: WebAccount | SeedAccount | Identity | ReadonlyIdentity | string | null,
    nodeURL: string = 'https://bitclout.com',
    otherCfg?: Partial<ClientConfig>
  ) {
    let identity: Identity | ReadonlyIdentity | undefined

    // The identity instance has already been initialized:
    if (isIdentityInstance(identityArg)) identity = identityArg
    // BitClout seeds are 128 bits with 12 word mnemonics, so this must be a mnemonic:
    else if (typeof identityArg === 'string' && (identityArg.trim().split(' ').length === 12)) {
      try {
        identity = new SeedAccount(identityArg)
      } catch {
        throw new InvalidConfigError('Unable to generate seed account from mnemonic')
      }
    }
    // Assume it's a public key:
    else if (typeof identityArg === 'string') identity = new ReadonlyIdentity(identityArg.trim())
    // // This must be the config object:
    // else if (isConfigWithIdentity(identityOrConfig)) {
    //   identity = identityOrConfig.identity
    // }
    // // This is a config object, but it doesn't have a valid identity:
    // else if (!!(identityOrConfig as any)?.identity) {
    //   throw Error('The identity instance passed is invalid. Please pass an instance of WebAccount, SeedAccount or ReadonlyIdentity.')
    // }
    // If the identity arg was still passed it must be invalid:
    else if (!!identityArg) {
      throw new InvalidConfigError('Invalid identity argument. Must be an instance of WebAccount, SeedAccount, ReadonlyIdentity; or a seed phrase or public key or null.')
    }
    // Otherwise, there is no identity (which is fine).

    super({
      nodeURL,
      identity,
      ...(otherCfg || {})
    })
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
