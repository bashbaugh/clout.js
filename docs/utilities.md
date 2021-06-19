
CloutJS comes with a small collection of utilities for the BitClout API.

### Units

- The BitClout API always uses "nanos" as a unit. One BitClout (or creator coin) is 1e9 (1000000000) nanos. To convert between nanos and full units, just multiply or divide by `1e9`. But just in case you can't remember that, we've added some highly complex functions, {@link cloutToNanos} and {@link nanosToClout}.
- Likewise, the smallest unit of a bitcoin is the [satoshi](https://en.bitcoin.it/wiki/Satoshi_(unit)) (1/1e8 bitcoins). We've also included {@link bitcoinToSatoshis} and {@link satoshisToBitcoin} for convenience.
