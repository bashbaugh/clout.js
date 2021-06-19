import { BaseTxnSubmissionResponse } from '.'

export interface GetTransactionResponse {
  TxnFound: boolean
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

export type SendBitcloutTxnResponse = BaseTxnSubmissionResponse

// TODO check meta type
export type FollowTxnResponse = BaseTxnSubmissionResponse<{
  FollowedPublicKey: string
  IsUnfollow: boolean
}>

export type LikeTxnResponse = BaseTxnSubmissionResponse<{
  LikedPostHash: number[]
  IsUnlike: boolean
}>

export type TransferCreatorCoinTxnResponse = BaseTxnSubmissionResponse<{
  ProfilePublicKey: string
  CreatorCoinToTransferNanos: number
  ReceiverPublicKey: string
}>

export type SendDiamondsTxnResponse = BaseTxnSubmissionResponse<
  {
    ProfilePublicKey: string
    CreatorCoinToTransferNanos: number
    ReceiverPublicKey: string
  },
  {
    DiamondLevel: string
    DiamondPostHash: string
  }
>
