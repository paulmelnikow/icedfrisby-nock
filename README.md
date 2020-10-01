# icedfrisby-nock

[![version](https://img.shields.io/npm/v/icedfrisby-nock?style=flat-square)][npm]
[![license](https://img.shields.io/npm/l/icedfrisby-nock?style=flat-square)][npm]
[![build](https://img.shields.io/circleci/project/github/paulmelnikow/icedfrisby-nock/main?style=flat-square)][build]
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen?style=flat-square)][coverage]
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4?style=flat-square)][prettier]

[npm]: https://npmjs.com/icedfrisby-nock
[build]: https://circleci.com/gh/paulmelnikow/icedfrisby-nock/tree/main
[coverage]: https://github.com/paulmelnikow/icedfrisby-nock/blob/main/.nycrc.json
[prettier]: https://prettier.io/

Concise support for mock requests in [IcedFrisby][].

[icedfrisby]: https://github.com/IcedFrisby/IcedFrisby/

## Usage

Compose icedfrisby with icedfrisby-nock.

```js
const frisby = require('icedfrisby-nock')(require('icedfrisby'))
```

or, more semantically, using the delightful [mixwith][]:

```js
const { mix } = require('mixwith')

const frisby = mix(require('icedfrisby')).with(require('./icedfrisby-nock'))
```

Allow connections to localhost, but simulate failure for any other HTTP
connections.

```js
await frisby.create(...)
  .get(...)
  .networkOff()
  .expectJSON(...)
  .run()
```

Mock one request, and simulate failure for any other HTTP connection.

`intercept()` automatically invokes `networkOff()`.

```js
await frisby.create(...)
  .get(...)
  .intercept(nock => nock('http://example.com')
    .get('/foobar')
    .reply(200))
  .expectJSON(...)
  .run()
```

Mock one request and allow all other HTTP connections.

```js
await frisby.create(...)
  .get(...)
  .intercept(nock => nock('http://example.com')
    .get('/foobar')
    .reply(200))
  .networkOn()
  .expectJSON(...)
  .run()
```

Mock one request only if a condition is truthy.

```js
const someCondition = true
await frisby.create(...)
  .get(...)
  .interceptIf(someCondition, nock => nock('http://example.com')
    .get('/foobar')
    .reply(200))
  .expectJSON(...)
  .run()
```

When using `intercept()`, `interceptIf()` or `networkOff()`, the plugin restores network access
when the test finishes.

To check if a Frisby object has an intercept set, inspect the `hasIntercept`
property.

To skip the test if an intercept is present, invoke `.skipIfIntercepted()` on
the chain. This is useful with when invoked from a shared setup function or
when performing conditional intercepts.

For the Nock API, refer to the [Nock docs][].

For the IcedFrisby API, refer to the [IcedFrisby docs][].

[mixwith]: https://github.com/justinfagnani/mixwith.js
[nock docs]: https://github.com/node-nock/nock#use
[icedfrisby docs]: https://github.com/IcedFrisby/IcedFrisby/blob/main/API.md

## Installation

```
npm install --save-dev icedfrisby nock icedfrisby-nock
```

## Who's using this

This project was developed for testing [Shields.io](https://shields.io/).

## Contribute

- Issue Tracker: https://github.com/paulmelnikow/icedfrisby-nock/issues
- Source Code: https://github.com/paulmelnikow/icedfrisby-nock

Pull requests welcome!

## Support

If you are having issues, please let me know.

## License

The project is licensed under the MIT license.
