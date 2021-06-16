import { Client } from '../../Client'

export function submitPost(
  this: Client,
  /** Post body */
  body: string
) {
  return this.handleTransactionRequest('submit-post', {
    UpdaterPublicKeyBase58Check: this.identity.bitcloutPublicKey,
    BodyObj: {
      Body: body
    },
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000
  })
}
