import { Identity } from '.'
import { NoWindowError } from '../errors'
import { nanoid } from 'nanoid'

export interface BitcloutAuthData {
  accessLevel: number
  accessLevelHmac: string
  encryptedSeedHex: string
  btcDepositAddress: string
  hasExtraText: boolean
  network: string
}

export interface LoginReturnType {
  /** An object mapping public keys to account credentials. */
  accounts: Record<string, BitcloutAuthData>,
  /** If a new account got signed in, it will be here */
  publicKeyAdded: string,
  accontAdded?: BitcloutAuthData
}

// TODO additional instructions about iframe, etc.
/**
 * Can be used client-side to interact with the BitClout identity service
 */
export class WebAccount extends Identity {
  private authData: BitcloutAuthData
  private iframe: HTMLIFrameElement

  /** Has the message listener been created? */
  private static listenerCreated: boolean
  /** A list of callback functions waiting for a response from the identity service */
  private static waitingQueue: {
    id?: string,
    callback: (data: any) => void
  }[] = []

  /**
   * Construct a bitclout identity that can sign transactions using the BitClout identity service embedded in an iframe.
   * You must first authenticate the user using {@link WebAccount.loginUser}, then pass the public key and account added to this constructor.
   * @param bitcloutPublicKey The public key of the user.
   * @param authData The identity service payload object for the user
   * @param iframe The iframe element of the embedded identity service
   */
  constructor (bitcloutPublicKey: string, authData: BitcloutAuthData, iframe: HTMLIFrameElement) {
    if (!window) {
      throw new NoWindowError()
    }

    super(bitcloutPublicKey)
    this.authData = authData
    this.iframe = iframe
  }

  private postMessage(msg: Record<string, any>) {
    this.iframe.contentWindow?.postMessage(msg, '*')
  }

  private static onMessage(m: MessageEvent) {
    if (m.origin.startsWith('https://identity.bitclout.com')) {
      if (m.data.method === 'initialize') {
        (m.source as WindowProxy).postMessage({
          id: m.data.id,
          service: 'identity'
        }, '*')
      }

      // Find a function in the queue that's waiting for this message
      const waitingCb = this.waitingQueue.find(w => (!w.id && !m.data.id) || w.id === m.data.id)?.callback
      if (waitingCb) waitingCb(m.data)
    }
  }

  private static waitForResponse(id?: string) {
    if (!WebAccount.listenerCreated) {
      window.addEventListener('message', m => WebAccount.onMessage(m))
      WebAccount.listenerCreated = true
    }

    // Add the resolve function the queue of waiting functions, so it will be called when the response is received.
    return new Promise<any>((resolve, reject) => {
      WebAccount.waitingQueue.push({
        id,
        callback: (data) => resolve(data)
      })
    })
  }

  public signTransaction (transactionHex: string) {
    this.postMessage({
      id: nanoid(),
      service: 'identity',
      method: 'sign',
      payload: this.authData,
    })
    return new Promise<string>((resolve, reject) => {
      
    })
  }

  // TODO handle initialization?

  public static waitForMessage() {
    return 
  }

  /**
   * Open a window for the user to login to their BitClout account.
   * @param accessLevel Which access level to authorize. {@link https://docs.bitclout.com/devs/identity-api#access-levels | Learn more}.
   * @returns An object of authenticated users' credentials
   */
  public static async loginUser(accessLevel: 1 | 2 | 3 | 4 = 2): Promise<LoginReturnType> {
    try {
      window.open(`https://identity.bitclout.com/log-in?accessLevelRequest=${accessLevel}`)
    } catch (e) {
      if (e instanceof ReferenceError) throw new NoWindowError()
    }

    const data = await this.waitForResponse()

    return {
      accounts: data.users,
      publicKeyAdded: data.publicKeyAdded,
      accountAdded: data.publicKeyAdded && data.users[data.publicKeyAdded]
    } as any
  }
}
