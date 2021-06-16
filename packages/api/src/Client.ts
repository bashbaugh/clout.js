import Account from './identity'
import { URL, URLSearchParams } from 'url'
import axiosLib, { AxiosInstance } from 'axios'

import { 
  submitPost, 
  healthCheck, 
  getExchangeRate 
} from './api'

const apiMethods = {
  transaction: {
    submitPost
  },
  node: {
    healthCheck,
    getExchangeRate,
  }
}

interface ClientConfig {
  /** Which network does the mnemonic (seed phrase) belong to? */
  network?: 'mainnet' | 'testnet'
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
export class Client {
  /** 
   * Client's account instance, used for signing transactions 
   * @internal
   * */
  public identity: Account

  private axios: AxiosInstance

  /* API: */

  /** General endpoints */
  readonly node: typeof apiMethods.node
  /** 
   * Alias to {@link Client.node} 
   * @ignore 
   * */
  readonly general: typeof apiMethods.node
  
  /** Transaction-related API endpoints */
  readonly transaction: typeof apiMethods.transaction
  /** 
   * Alias to {@link Client.transaction} 
   * @ignore 
   * */
  readonly txn: typeof apiMethods.transaction

  /**
   * Create a client for a single account and node
   * @param mnemonic The seed phrase of the account
   * @param nodeUrl URL of the BitClout node. This is bitclout.com by default, though it is recommended to host your own node.
   * @param cfg Client config
   */
  constructor (mnemonic: string, nodeUrl: string = 'https://bitclout.com', cfg?: ClientConfig) {
    try {
      if (!nodeUrl) throw Error()
      new URL(nodeUrl)
    } catch {
      throw Error('Please pass a valid node URL to the client constructor')
    }

    this.identity = new Account(mnemonic, cfg?.network)

    this.axios = axiosLib.create({
      baseURL: nodeUrl + '/api/v0/',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    // Bind all the API methods
    this.transaction = this.bindEndpointFunctions(apiMethods.transaction)
    this.txn = this.transaction

    this.node = this.bindEndpointFunctions(apiMethods.node)
    this.general = this.node
  }

  /**
   * Binds every function in an object to this client instance so that they can use the client to send requests
   * @param functions An object of API functions
   */
  private bindEndpointFunctions<T extends Record<string, (this: Client, ...args: any[]) => Promise<Record<string, any>>>>(
    functions: T
  ): T {
    // Iterate through the functions and bind them to `this`
    return Object.fromEntries(
      Object.entries(functions)
        .map(([name, func]) => [name, func.bind(this)])
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
    data?: Record<string, any>, 
    method: 'GET' | 'POST' = 'POST'
  ): Promise<T> {
    let result
    if (method === 'POST') {
      result = await this.axios.post(endpoint, data)
    } else {
      result = await this.axios.get(endpoint, {
        params: data
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
  public submitTransaction(txn: string) {
    return this.callApi('submit-transaction', {
      TransactionHex: txn
    })
  }

  /**
   * Signs and submits a transaction
   * @param txn The unsigned transaction hex
   * @returns The API response
   */
   public signAndSubmitTransaction(txn: string) {
    return this.submitTransaction(this.identity.signTransaction(txn))
  }

  /**
   * Sends a POST request to an API endpoint, then signs and submits the returned transaction hex.
   * @internal
   * @param endpoint Endpoint to call (nodeUrl/api/v0/ENDPOINT)
   * @param data JSON body (or query params for GET request)
   * @returns the second API response after signing and submitting
   */
  public async handleTransactionRequest (endpoint: string, data?: Record<string, any>) {
    const response = await this.callApi(endpoint, data)
    return await this.signAndSubmitTransaction(response.TransactionHex)
  }
}
