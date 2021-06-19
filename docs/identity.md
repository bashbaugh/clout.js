
CloutJS comes with three built-in classes for authenticating accounts and signing transactions.

- {@link SeedAccount} is for server-side bots and apps. It derives the account's private keypair and public key from a mnemonic (seed phrase). Be EXTREMELY CAREFUL when using this, and take great care to keep the seed phrase secure. Also, **NEVER use this for user accounts or ask users for their seed phrases**. Use WebAccount instead.

- {@link WebAccount} can be used on user-facing websites and apps to take actions on behalf of users. It's designed to interface with the [BitClout identity API](https://docs.bitclout.com/devs/identity-api) for authenticatin users and signing transactions. See {@page Using WebAccount} to learn more.

- {@link ReadonlyIdentity} can be used anywhere for readonly access to any account, as it only requires a public key.

### Implementing your own identity service

If neither SeedAccount nor WebAccount work for you, you can extend the {@link Identity} class to implement your own identity service. For example:

```
import { Identity, BitcloutClient } from '@cloutjs/api'

class CustomIdentity extends Identity {
  constructor(customArgs) {
    // ...
    super(customArgs.publicKey) // Make sure to pass the user's public bitclout key to the super method.
  }

  async signTransaction(txnHex) {
    // Sign the transaction
    // ...
    return signedTransactionHex
  }
}

const myAccount = new CustomIdentity(...)

const myClient = new BitcloutClient(myAccount)

```

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

_Depending on your use case, it may be a good idea to keep a list of used JWTs and not accept the same one twice._
