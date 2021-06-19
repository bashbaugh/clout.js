
CloutJS comes with a small collection of utilities for the BitClout API.

### Units

- The BitClout API always uses "nanos" as a unit. One BitClout (or creator coin) is 1e9 (1000000000) nanos. To convert between nanos and full units, just multiply or divide by `1e9`. But just in case you can't remember that, we've added some highly complex functions, {@link cloutToNanos} and {@link nanosToClout}.
- Likewise, the smallest unit of a bitcoin is the [satoshi](https://en.bitcoin.it/wiki/Satoshi_(unit)) (1/1e8 bitcoins). We've also included {@link bitcoinToSatoshis} and {@link satoshisToBitcoin} for convenience.

### JWTs & Authenticating BitClout Accounts

You can use {@link validateJWT} to verify that a JWT was signed by the owner of a certain public key. This is useful, for example, if you need to confirm that a request is actually coming from a certain user. 

For example, if you're building an app and need to verify a user's identity on the backend, you can use {@link WebAccount.signJWT} to generate a short-lived JWT from the frontend and include that along with the user's public key in your request to the backend. Then, on the backend you can use {@link validateJWT} to confirm that the user is, in fact, the owner of the public key:

```
import { WebAccount, validateJWT } from '@cloutjs/api'

/* Frontend: */
// Log the user in and get their private key first
const userIdentity = new WebAccount(...)
const jwt = userIdentity.signJWT()
sendRequest(userIdentity.bitcloutPublicKey, jwt, ...)

/* Backend: */

onRequest(req => {
  try {
    const payload = validateJWT(req.jwt, req.bitcloutPublicKey)
    // JWT is valid and was signed by the owner of the public key!
  } catch () {
    // Invalid or expired JWT!!!
  }
})

```

Or, you could use it with {@link SeedAccount} on the backend to prove the identity of your server/bot to another, for example.

_Note that it's probably good practice to keep a list of used JWTs and not accept the same one twice_.
