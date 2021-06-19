import { satoshisToBitcoin } from '.'
import { BaseClient, ClientConfig } from './BaseClient'
import { InvalidConfigError, NotAuthenticatedError } from './errors'
import { Identity, ReadonlyIdentity, SeedAccount, WebAccount } from './identity'
import * as api from './types'
import { requireSignature, isIdentityInstance } from './util'
import adminEndpoints from './adminEndpoints'

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
  // TODO this is not working. Typedoc is not expanding the object into a separate module thing, which we need it to do.
  /** Node admin endpoints */
  admin: typeof adminEndpoints

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
  constructor(
    identityArg?:
      | WebAccount
      | SeedAccount
      | Identity
      | ReadonlyIdentity
      | string
      | null,
    nodeURL = 'https://bitclout.com',
    otherCfg?: Partial<ClientConfig>
  ) {
    let identity: Identity | ReadonlyIdentity | undefined

    // The identity instance has already been initialized:
    if (isIdentityInstance(identityArg)) identity = identityArg
    // BitClout seeds are 128 bits with 12 word mnemonics, so this must be a mnemonic:
    else if (
      typeof identityArg === 'string' &&
      identityArg.trim().split(' ').length === 12
    ) {
      try {
        identity = new SeedAccount(identityArg)
      } catch {
        throw new InvalidConfigError(
          'Unable to generate seed account from mnemonic'
        )
      }
    }
    // Assume it's a public key:
    else if (typeof identityArg === 'string')
      identity = new ReadonlyIdentity(identityArg.trim())
    // // This must be the config object:
    // else if (isConfigWithIdentity(identityOrConfig)) {
    //   identity = identityOrConfig.identity
    // }
    // // This is a config object, but it doesn't have a valid identity:
    // else if (!!(identityOrConfig as any)?.identity) {
    //   throw Error('The identity instance passed is invalid. Please pass an instance of WebAccount, SeedAccount or ReadonlyIdentity.')
    // }
    // If the identity arg was still passed it must be invalid:
    else if (identityArg) {
      throw new InvalidConfigError(
        'Invalid identity argument. Must be an instance of WebAccount, SeedAccount, ReadonlyIdentity; or a seed phrase or public key or null.'
      )
    }
    // Otherwise, there is no identity (which is fine).

    super({
      nodeURL,
      identity,
      ...(otherCfg || {}),
    })

    this.admin = this.bindEndpointFunctions(adminEndpoints)
  }

  /* Endpoints */

  /**
   * Checks the sync status of the node. Throws an error if check is not succesful.
   * @returns `ok: true` if the node is running and synced, otherwise throws an error.
   */
  public async healthCheck(): Promise<{ ok: true }> {
    await this.callApi('health-check', {}, 'GET')
    // If the request was succesful, that means the check succeeded.
    return {
      ok: true,
    }
  }

  /**
   * Gets the current exchange rate
   * @beta
   */
  public async getExchangeRate(): Promise<
    api.GetExchangeRateResponse & api.GetExchangeRateResponseExtra
  > {
    const res = await this.callApi<api.GetExchangeRateResponse>(
      'get-exchange-rate',
      {},
      'GET'
    )
    // TODO fix. Why is this showing a different rate than on the site? Maybe the site is showing a value from the exchange.
    const usdER =
      (satoshisToBitcoin(res.SatoshisPerBitCloutExchangeRate) *
        res.USDCentsPerBitcoinExchangeRate) /
      100
    return {
      ...res,
      USDPerBitCloutExchangeRate: usdER,
    }
  }

  /** Get state of BitClout, such as cost of profile creation and diamond tiers*/
  public getAppState() {
    return this.callApi<api.GetAppStateResponse>('get-app-state', {})
  }

  /**
   * Check if a transaction is currently in the mempool
   * @param TxnHashHex This is the transaction **hash** hex, not the full transaction hex.
   */
  public async checkTransaction(TxnHashHex: string) {
    return this.callApi<api.GetTransactionResponse>('get-txn', {
      TxnHashHex,
    })
  }

  // TODO images and stuff
  /**
   * Update profile
   * @param updateFields Object of fields to update
   * @returns Information about the update transaction
   * @identityRequired
   */
  @requireSignature()
  public async updateProfile(updateFields: api.UpdateProfileInput) {
    if (!this.identity?.canSign)
      throw new NotAuthenticatedError('updateProfile')
    // If a new PFP is being set, upload it first
    const newPFP = updateFields.newProfilePic
      ? (await this.uploadImage(updateFields.newProfilePic)).ImageURL
      : undefined
    return this.callApi<api.UpdateProfileTxnResponse>('update-profile', {
      UpdaterPublicKeyBase58Check: this.identity.bitcloutPublicKey,
      NewUsername: updateFields.newUsername,
      NewDescription: updateFields.newDescription,
      NewProfilePic: newPFP,
      NewCreatorBasisPoints: updateFields.newFoundersReward * 1e4,
      NewStakeMultipleBasisPoints:
        updateFields.newStakeMultipleBasisPoints * 1e4,
      IsHidden: updateFields.isHidden,
      MinFeeRateNanosPerKB: 1000,
    })
  }

  /**
   * Send bitclout to another wallet
   * @param recipient The BitClout public key OR username of the recipient
   * @param amountNanos How many nanos of BitClout to send
   * @returns The transaction result
   * @identityRequired
   */
  @requireSignature()
  public sendBitclout(recipient: string, amountNanos: number) {
    return this.handleRequestWithTxn<api.SendBitcloutTxnResponse>(
      'send-bitclout',
      {
        SenderPublicKeyBase58Check: this.identity!.bitcloutPublicKey,
        RecipientPublicKeyOrUsername: recipient,
        AmountNanos: amountNanos,
        MinFeeRateNanosPerKB: 1000,
      }
    )
  }

  /**
   * Submit a post
   * @returns The transaction result
   * @identityRequired
   */
  @requireSignature()
  public submitPost(
    /** Post body text */
    body: string
  ) {
    return this.handleRequestWithTxn<api.PostTxnResponse>('submit-post', {
      UpdaterPublicKeyBase58Check: this.identity!.bitcloutPublicKey,
      BodyObj: {
        Body: body,
      },
      IsHidden: false,
      MinFeeRateNanosPerKB: 1000,
    })
  }

  @requireSignature()
  private followOrUnfollow(followed: string, unfollow: boolean) {
    return this.handleRequestWithTxn<api.FollowTxnResponse>(
      'create-follow-txn-stateless',
      {
        FollowerPublicKeyBase58Check: this.identity!.bitcloutPublicKey,
        FollowedPublicKeyBase58Check: followed,
        IsUnfollow: unfollow,
        MinFeeRateNanosPerKB: 1000,
      }
    )
  }

  /**
   * Follow a user.
   * @param publicKey The public key of the user to follow
   * @returns The follow transaction result
   * @identityRequired
   */
  @requireSignature()
  public follow(publicKey: string) {
    return this.followOrUnfollow(publicKey, false)
  }

  /**
   * Unfollow a user.
   * @param publicKey The public key of the user to unfollow
   * @returns The follow transaction result
   * @identityRequired
   */
  @requireSignature()
  public unfollow(publicKey: string) {
    return this.followOrUnfollow(publicKey, true)
  }

  @requireSignature()
  private likeOrUnlike(postHash: string, unlike: boolean) {
    return this.handleRequestWithTxn<api.LikeTxnResponse>(
      'create-like-stateless',
      {
        ReaderPublicKeyBase58Check: this.identity!.bitcloutPublicKey,
        LikedPostHashHex: postHash,
        IsUnlike: unlike,
        MinFeeRateNanosPerKB: 1000,
      }
    )
  }

  /**
   * Like a post
   * @param postHash The hash hex of the post to like
   * @returns The like transaction result
   * @identityRequired
   */
  @requireSignature()
  public like(postHash: string) {
    return this.likeOrUnlike(postHash, false)
  }

  /**
   * Unlike a post
   * @param postHash The hash hex of the post to unlike
   * @returns The like transaction result
   * @identityRequired
   */
  @requireSignature()
  public unlike(postHash: string) {
    return this.likeOrUnlike(postHash, true)
  }

  /**
   * Transfers some creator coin to another wallet
   * @param creator The Bitclout public key of the coin's creator
   * @param recipient The Bitclout public key or username of the coin recipient
   * @param coinNanos The amount of nanos of coin to transfer
   * @returns The transfer transaction result
   */
  public transferCreatorCoin(
    creator: string,
    recipient: string,
    coinNanos: number
  ) {
    return this.handleRequestWithTxn<api.TransferCreatorCoinTxnResponse>(
      'transfer-creator-coin',
      {
        SenderPublicKeyBase58Check: this.identity!.bitcloutPublicKey,
        CreatorPublicKeyBase58Check: creator,
        ReceiverUsernameOrPublicKeyBase58Check: recipient,
        CreatorCoinToTransferNanos: coinNanos,
        MinFeeRateNanosPerKB: 1000,
      }
    )
  }

  /**
   * Give diamonds to a post
   * @param recipient The recipient of the diamonds (the creator of the post)
   * @param postHash The post hash hex
   * @param diamondLevel How many diamonds? Use {@link BitcloutClient.getAppState} to get the diamond tiers.
   * @returns The diamond transaction result
   * @identityRequired
   */
  @requireSignature()
  public sendDiamonds(
    recipient: string,
    postHash: string,
    diamondLevel: number
  ) {
    return this.handleRequestWithTxn<api.SendDiamondsTxnResponse>(
      'send-diamonds',
      {
        SenderPublicKeyBase58Check: this.identity!.bitcloutPublicKey,
        ReceiverPublicKeyBase58Check: recipient,
        DiamondPostHashHex: postHash,
        DiamondLevel: diamondLevel,
        MinFeeRateNanosPerKB: 1000,
      }
    )
  }
  /* MEDIA */

  /**
   * Uploads an image to the BitClout node from current identity
   * @identityRequired
   */
  @requireSignature()
  public async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'UserPublicKeyBase58Check',
      this.identity!.bitcloutPublicKey
    )
    formData.append('JWT', await this.getJWT())
    return this.callApi<api.UploadImageResponse>('upload-image', formData)
  }

  // TODO idk how this endpoint is supposed to work
  /**
   *
   * @param shortVideoID
   * @returns
   * @ignore
   */
  public async getFullTikTokURL(shortVideoID: string) {
    return this.callApi<api.GetFullTikTokURLResponse>('get-full-tiktok-url', {
      TikTokShortVideoID: shortVideoID,
    })
  }
}
