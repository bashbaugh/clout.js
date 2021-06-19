import { Identity } from './Identity'
import { NoWindowError, SigningError } from '../errors'
import { nanoid } from 'nanoid'

export interface BitcloutAuthData {
  accessLevel: number
  accessLevelHmac: string
  encryptedSeedHex: string
  btcDepositAddress: string
  hasExtraText: boolean
  network: string
}

// TODO test this

export interface LoginReturnType {
  /** An object mapping public keys to account credentials. */
  accounts: Record<string, BitcloutAuthData>
  /** If a new account got signed in, it will be here */
  publicKeyAdded: string
  accontAdded?: BitcloutAuthData
}

// TODO additional instructions about iframe, etc.
/**
 * Can be used client-side to interact with the BitClout identity service. This is
 */
export class WebAccount extends Identity {
  private authData: BitcloutAuthData
  private iframe: HTMLIFrameElement

  /** Has the message listener been created? */
  private static listenerCreated: boolean
  /** A list of callback functions waiting for a response from the identity service */
  private static waitingQueue: {
    id?: string
    callback: (data: any) => void
  }[] = []

  /**
   * Construct a bitclout identity that can sign transactions using the BitClout identity service embedded in an iframe.
   * You must first authenticate the user using {@link WebAccount.loginUser}, then pass the public key and account added to this constructor.
   * @param bitcloutPublicKey The public key of the user.
   * @param authData The identity service payload object for the user
   * @param iframe The iframe element of the embedded identity service
   */
  constructor(
    bitcloutPublicKey: string,
    authData: BitcloutAuthData,
    iframe: HTMLIFrameElement
  ) {
    if (!window) {
      throw new NoWindowError()
    }

    super(bitcloutPublicKey)
    this.authData = authData
    this.iframe = iframe
  }

  /**
   * Posts a message to the identity service iframe. {@link https://docs.bitclout.com/devs/identity-api#iframe-context | Learn more}.
   * @param msg The message (in JSON format). Must contain an `id` if a response is expected (see {@link WebAccount.waitForResponse})
   */
  public postMessage(msg: Record<string, any>) {
    this.iframe.contentWindow?.postMessage(msg, '*')
  }

  /** Window message listener */
  private static onMessage(m: MessageEvent) {
    if (m.origin.startsWith('https://identity.bitclout.com')) {
      if (m.data.method === 'initialize') {
        // prettier-ignore
        (m.source as WindowProxy).postMessage(
          {
            id: m.data.id,
            service: 'identity',
          },
          '*'
        )
      }

      // Find a function in the queue that's waiting for this message
      const waitingCb = this.waitingQueue.find(
        (w) => (!w.id && !m.data.id) || w.id === m.data.id
      )?.callback
      if (waitingCb) waitingCb(m.data)
    }
  }

  /**
   * Waits for a message from the identity service, and returns the first one that matches the supplied ID
   * @param id The ID sent with the request (or leave empty to return the first message recieved)
   * @returns The response data
   */
  public static waitForResponse(id?: string) {
    if (!WebAccount.listenerCreated) {
      window.addEventListener('message', (m) => WebAccount.onMessage(m))
      WebAccount.listenerCreated = true
    }

    // Add the resolve function the queue of waiting functions, so it will be called when the response is received.
    return new Promise<any>((resolve) => {
      WebAccount.waitingQueue.push({
        id,
        callback: (data) => resolve(data),
      })
    })
  }

  /**
   * First, sends a request to the embedded iframe containing the account data and unsugned transaction hex, then waits for a response.
   * If the response contains a signed hex, it's returned. Otherwise, it opens a new window to ask the user for approval to sign the transaction.
   * If neither method succeeds, it throws a SigningError
   * @param transactionHex The unsigned transaction hex
   * @param skipApproval
   * If true, a SigningError will be thrown immediately without opening an approval window if the initial response doesn't contain a signed transaction
   * @returns The signed transaction hex
   */
  public async signTransaction(transactionHex: string, skipApproval?: boolean) {
    const id = nanoid()
    this.postMessage({
      id,
      service: 'identity',
      method: 'sign',
      payload: {
        ...this.authData,
        transactionHex,
      },
    })

    const { payload } = await WebAccount.waitForResponse(id)

    if (payload.approvalRequired && !skipApproval) {
      const w = window.open(
        `https://identity.bitclout.com/approve?tx=${transactionHex}`
      )
      const signedTxn = (await WebAccount.waitForResponse(null as any))?.payload
        ?.signedTransactionHex
      w?.close()
      if (signedTxn) return signedTxn
    } else if (payload.signedTransactionHex) {
      return payload.signedTransactionHex
    }

    throw new SigningError(`Couldn't get transaction from identity service.`)
  }

  /**
   * Sends a request to the embedded identity service for a signed JWT. Throws a SigningError if the response doesn't contain a JWT.
   * @returns A JWT signed with the user's private key, which can be used to authenticate them to the backend.
   */
  public async signJWT() {
    if (this.authData.accessLevel < 2) {
      throw new Error('Need at least access level 2 to sign JWTs')
    }

    const id = nanoid()
    this.postMessage({
      id,
      service: 'identity',
      method: 'jwt',
      payload: this.authData,
    })

    const { payload } = await WebAccount.waitForResponse(id)

    if (payload.jwt) return payload.jwt

    throw new SigningError(`Couldn't get signed JWT from identity service.`)
  }

  /**
   * Open a window for the user to login to their BitClout account ({@Link https://docs.bitclout.com/devs/identity-api#login | learn more}).
   * @param accessLevel Which access level to authorize. {@link https://docs.bitclout.com/devs/identity-api#access-levels | Learn more}.
   * @returns An object of authenticated users' credentials. You can pass the returned public key and account data to the constructor.
   */
  public static async loginUser(
    accessLevel: 0 | 2 | 3 | 4 = 2
  ): Promise<LoginReturnType> {
    if (!window) {
      throw new NoWindowError()
    }
    const w = window.open(
      `https://identity.bitclout.com/log-in?accessLevelRequest=${accessLevel}`
    )

    const data = await this.waitForResponse()

    w?.close()

    return {
      accounts: data.users,
      publicKeyAdded: data.publicKeyAdded,
      accountAdded: data.publicKeyAdded && data.users[data.publicKeyAdded],
    } as any
  }

  /**
   * Sign user out (opens another window).
   * **Instance will no longer work after calling this.**
   */
  public logoutUser() {
    window.open(
      `https://identity.bitclout.com/logout?publicKey=${this.bitcloutPublicKey}`
    )
  }
}
