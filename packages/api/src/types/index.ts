export * from './post'
export * from './user'

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

