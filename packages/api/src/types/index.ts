export * from './post'
export * from './user'
export * from './transaction'

// Why weren't this files working as d.ts files...

export interface Transaction<MetaType> {
  TxInputs: {
    TxID: number[]
    Index: number
  }[]
  TxOutputs: {
    PublicKey: string
    AmountNanos: number
  }[]
  /** Metadata about the transaction operation. **Most strings are base64 encoded**. */
  TxnMeta: MetaType
  PublicKey: string
  ExtraData: any
  /** Transaction's ECDSA signature */
  Signature: {
    R: number
    S: number
  }
  TxnTypeJSON: number // TODO map transaction type number to enum (and text)
}

export interface BaseTxnSubmissionResponse<TxnMetaType> {
  Transaction: Transaction<TxnMetaType>
  TxnHashHex: string
}

export interface GetExchangeRateResponse {
  SatoshisPerBitCloutExchangeRate: number
  NanosSold: number
  USDCentsPerBitcoinExchangeRate: number
}

export interface GetExchangeRateResponseExtra {
  /**
   * How many US dollars per Bitclout?
   * Calculated as `SatoshisPerBitCloutExchangeRate / 1e8 * USDCentsPerBitcoinExchangeRate / 100`
   */
  USDPerBitCloutExchangeRate: number
}

export interface GetAppStateResponse {
  AmplitudeKey: string
  AmplitudeDomain: string
  MinSatoshisBurnedForProfileCreation: number
  /** Is this node on the testnet? */
  IsTestnet: boolean
  /** The support email associated with this node */
  SupportEmail: string
  ShowProcessingSpinners: boolean
  HasStarterBitCloutSeed: boolean
  HasTwilioAPIKey: boolean
  /** Fee to create a BitClout profile */
  CreateProfileFeeNanos: number
  CompProfileCreation: boolean
  /** Map of diamond tiers to values */
  DiamondLevelMap: Record<number, number>
  HasWyreIntegration: boolean
}

export interface UploadImageResponse {
  /** The URL of the uploaded image on the node. */
  ImageURL: string
}

export interface GetFullTikTokURLResponse {
  FullTikTokURL: string
}
