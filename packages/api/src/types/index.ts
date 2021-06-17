export * from './post'
export * from './user'

// Why weren't this files working as d.ts files...

export interface Transaction <MetaType> {
  TxInputs: {
    TxID:         number[],
    Index:        number
  }[]
  TxOutputs: {
    PublicKey:    string,
    AmountNanos:  number
  }[]
  TxnMeta:        MetaType
  PublicKey:      string
  ExtraData:      any
  Signature:      any // TODO I'm not sure what type this is. It seems to have an S and R number?
  TxnTypeJSON:    number // TODO map transaction type number to enum (and text)
}

export interface BaseTxnSubmissionResponse <TxnMetaType> {
  Transaction: Transaction<TxnMetaType>
  TxnHashHex: string
}

export interface GetExchangeRateResponse {
  SatoshisPerBitCloutExchangeRate: number
  NanosSold: number
  USDCentsPerBitcoinExchangeRate: number
}

export interface GetAppStateResponse {
  AmplitudeKey:                       string
	AmplitudeDomain:                    string
	MinSatoshisBurnedForProfileCreation:number
  /** Is this node on the testnet? */
	IsTestnet:                          boolean
  /** The support email associated with this node */
	SupportEmail:                       string
	ShowProcessingSpinners:             boolean
	HasStarterBitCloutSeed:             boolean
	HasTwilioAPIKey:                    boolean
  /** Fee to create a BitClout profile */
	CreateProfileFeeNanos:              number
	CompProfileCreation:                boolean
  /** Map of diamond tiers to values */
	DiamondLevelMap:                    Record<number, number>
	HasWyreIntegration:                 boolean
}
