import { BaseTxnSubmissionResponse, PostEntryResponse } from './index'

/** Represents a creator coin */
export interface CoinEntry {
  // TODO convert to founder's reward percentage
  /**
   * The amount the owner of this profile receives when there is a "net new" purchase of their coin.
   */
  CreatorBasisPoints: number

  /**
   * The amount of BitClout backing the coin.
   * Whenever a user buys a coin from the protocol this amount increases, and whenever a user sells a coin to the protocol this decreases.
   */
  BitCloutLockedNanos: number

  /**
   * The number of public keys who have holdings in this creator coin.
   */
  NumberOfHolders: number

  /** The number of coins currently in circulation. */
  CoinsInCirculationNanos: number

  /**
   * This field keeps track of the highest number of coins that has ever been in circulation.
   * It is used to determine when a creator should receive a "founder reward."
   */
  CoinWatermarkNanos: number
}

/** Represents a user profile */
export interface ProfileEntryResponseFull {
  PublicKeyBase58Check: string
  Username: string
  Description: string
  IsHidden: boolean
  IsReserved: boolean
  IsVerified: boolean
  Comments: PostEntryResponse[]
  Posts: PostEntryResponse[]
  // Creator coin fields
  CoinEntry: CoinEntry
  CoinPriceBitCloutNanos: number

  /** Profiles of users that hold the coin + their balances. */
  // UsersThatHODL: []*BalanceEntryResponse // TODO
  UsersThatHODL: any
}

export interface UpdateProfileInput {
  newUsername?: string
  newDescription?: string
  newProfilePic: File
  /**
   * A new founders reward percentage, as a number between 0 and 1.
   * (will be converted to NewCreatorBasisPoints internally)
   */
  newFoundersReward: number
  newStakeMultipleBasisPoints: number // TODO ya
  isHidden?: boolean
}

export interface TxnMetaUpdateProfile {
  ProfilePublicKey: string
  NewUsername: string
  NewDescription: string
  NewProfilePic: string
  NewCreatorBasisPoints: number
  NewStakeMultipleBasisPoints: number
  IsHidden: boolean
}

export type UpdateProfileTxnResponse =
  BaseTxnSubmissionResponse<TxnMetaUpdateProfile>
