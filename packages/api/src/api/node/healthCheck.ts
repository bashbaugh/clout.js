import { Client } from '../../Client'

/**
 * Checks the sync status of the node. Throws an error if check is not succesful.
 * @returns `ok: true` if the node is running and synced, otherwise throws an error.
 */
export async function healthCheck(
  this: Client,
) {
  await this.callApi('health-check', {}, 'GET')
  // If the request was succesful, that means the check succeeded.
  return {
    ok: true
  }
}
