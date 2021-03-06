# Clout.JS

Clout.JS is a JavaScript and TypeScript API client and framework for [BitClout](https://bitclout.com/). Painlessly write bots, make requests on behalf of users, and more.

### Why?

The [BitClout API](https://docs.bitclout.com/devs/backend-api#admin-transaction-endpoints) requires a few extra steps such as signing transactions. Additionally, its documentation is not complete, and it's typed in Go, meaning you'll have to write your own types for it if you're using TypeScript. This library aims to make it easier to interact with the BitClout API by providing helpful utilities for authenticating users and bots, along with better types and documentation.

### Features

- Built-in classes for handling transaction signing and authentication
- TypeScript types on all endpoints (though they {@page Endpoints | aren't all implemented yet} - that's a work in progress)
- Helpful utilities

See {@page Getting Started} for installation and usage instructions.

--- 

_Tips: $clout/BC1YLikPgd9jPhWBFbQ4wwyBr6hVx6GqTTutAfJQEzVDRNCp9szprt5_