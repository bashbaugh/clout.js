
### Installation

```
yarn add @cloutjs/api
```
or
```
npm i @cloutjs/api
```

### Usage

```
import { BitcloutClient } from '@cloutjs/api // or require

// TODO demo usage
```

### Signing Transactions Using a Seed Phrase

Actions such as posting, following, trading, etc. are actually "transactions". BitClout provides endpoints for generating transaction hexes, but before they can be confirmed they must be signed and resubmitted. CloutJS handles this automatically if you provide an {@link Identity} instance, such as {@link SeedAccount}, which derives an account's keychain from its seed phrase.

```
import { BitcloutClient, SeedAccount } from '@cloutjs/api'

// Passing a seed phrase directly to the client constructor will cause it to automatically generate a SeedClient
const client = new BitcloutClient(process.env.BITCLOUT_MNEMONIC_A)

// The identity can be changed at any time:
client.identity = new SeedAccount(process.env.BITCLOUT_MNEMONIC_B, 'mainnet')

// Now, endpoints like submitPost will work:
client.submitPost('Hello from CloutJS!')

// You can access identity methods and properties:
console.log('My public key is: ' + client.identity.bitcloutPublicKey)
```

Please _**NEVER collect user seed phrases/mnemonics/private keys, even with good intentions**_. 

### Signing Transactions on Behalf of Users

SeedAccount can be useful if you're building a bot or want to programatically control your own account, for example, but if you're building an web app that needs to authenticate users or sign transactions on their behalf, you'll need to use BitClout's official [identity service](https://docs.bitclout.com/devs/identity-api). {@link WebAccount} can help with this. Read {@page Using WebAccount} to learn how to use it.

Note: WebAccount does not yet support using the identity service with a webview, so it **won't work with mobile apps**. If you need this, feel free to duplicate the WebAccount class to a MobileAccount class and make the changes [described here](https://docs.bitclout.com/devs/identity-api#mobile-webview-support). Please open a PR if you do so!

For more information about identities and authentication, please see [Identity & Authentication](identity).
