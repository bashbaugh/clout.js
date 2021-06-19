import { Identity, ReadonlyIdentity } from './identity'
import { URL } from 'url'
import axiosLib, { AxiosInstance } from 'axios'
import { NotAuthenticatedError } from './errors'

export interface ClientConfig {
  /** URL of the BitClout node. This is bitclout.com by default, though it is recommended to host your own node. */
  nodeURL: string

  /**
   * An instance of {@link WebAccount} (for client-side users),
   * {@link SeedAccount} (for server-side bots), or {@link ReadonlyIdentity} (for accessing any profile in readonly mode)
   */
  identity?: Identity | ReadonlyIdentity
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
export class BaseClient {
  /**
   * Client's identity instance, used for generating and signing transactions, etc.
   */
  public identity?: Identity | ReadonlyIdentity

  private axios: AxiosInstance

  constructor(cfg: ClientConfig) {
    try {
      if (!cfg.nodeURL) throw Error()
      new URL(cfg.nodeURL) // Confirm that it's valid
    } catch {
      throw Error('Please pass a valid node URL to the client constructor')
    }

    this.identity = cfg.identity

    this.axios = axiosLib.create({
      baseURL: cfg.nodeURL + '/api/v0/',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Binds every function in an object to this client instance so that they can use the client to send requests
   * @param functions An object of API functions
   */
  protected bindEndpointFunctions<
    T extends Record<
      string,
      (this: BaseClient, ...args: any[]) => Promise<Record<string, any>>
    >
  >(functions: T): T {
    // Iterate through the functions and bind them to `this`
    return Object.fromEntries(
      Object.entries(functions).map(([name, func]) => [name, func.bind(this)])
    ) as T
  }

  /**
   * Make a call to the node API
   * @param endpoint Endpoint to call (nodeUrl/api/v0/ENDPOINT)
   * @param data JSON body (or query params for GET request)
   * @param method GET or POST; defualts to POST
   * @returns the API response
   */
  public async callApi<T extends Record<string, any>>(
    endpoint: string,
    data?: Record<string, any> | FormData,
    method: 'GET' | 'POST' = 'POST'
  ): Promise<T> {
    let result
    if (method === 'POST') {
      result = await this.axios.post(endpoint, data)
    } else {
      result = await this.axios.get(endpoint, {
        params: data,
      })
    }

    return result.data

    // TODO error handling
    // TODO retries
  }

  /**
   * Submits a signed transaction using the /submit-transaction endpoint
   * @param txn The signed transaction hex
   * @returns The API response
   */
  public submitTransaction<T extends Record<string, any>>(
    txn: string
  ): Promise<T> {
    return this.callApi<T>('submit-transaction', {
      TransactionHex: txn,
    })
  }

  /**
   * Signs and submits a transaction
   * @param txn The unsigned transaction hex
   * @returns The API response
   */
  public async signAndSubmitTransaction<T extends Record<string, any>>(
    txn: string
  ): Promise<T> {
    if (!this.identity?.canSign) throw new NotAuthenticatedError('signTransaction')
    return this.submitTransaction(await this.identity.signTransaction(txn))
  }

  /**
   * Sends a POST request to an API endpoint, then signs and submits the returned transaction hex.
   * @internal
   * @param endpoint Endpoint to call (nodeUrl/api/v0/ENDPOINT)
   * @param data JSON body (or query params for GET request)
   * @returns the second API response after signing and submitting
   */
  public async handleRequestForTxn<T extends Record<string, any>>(
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> {
    const response = await this.callApi(endpoint, data)
    return await this.signAndSubmitTransaction<T>(response.TransactionHex)
  }

  /** Get a JWT from the identity instance */
  protected getJWT() {
    if (!this.identity?.canSign) throw new NotAuthenticatedError('getJWT')
    return this.identity.signJWT()
  }
}
