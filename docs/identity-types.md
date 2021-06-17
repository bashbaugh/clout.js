
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
