# @CloutJS/api

CloutJS is an API client and bot framework for Bitclout.

## Installation

```bash
yarn add @cloutjs/api
```

or 
```bash
npm i @cloutjs/api
```

## Usage

```
import { Client } from '@cloutjs/api'

const client = new Client('figure various run...', 'https://my-bitclout-node.io')

client.submitPost('Hello BitClout!')
  .then(res => {
    const username = res.PostEntryResponse.ProfileEntryResponse.Username
    console.log(`Posted succesfully on ${username}'s account!`)
  })
```
