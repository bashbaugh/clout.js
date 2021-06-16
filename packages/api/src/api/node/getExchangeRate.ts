import { Client } from '../../Client'

export interface GetExchangeRateResponse {
  SatoshisPerBitCloutExchangeRate: number
  NanosSold: number
  USDCentsPerBitcoinExchangeRate: number
}

export async function getExchangeRate(
  this: Client,
): Promise<GetExchangeRateResponse> {
  const res = await this.callApi<any>('get-exchange-rate', {}, 'GET')
  return res
}
