# icedfrisby-nock

[![version](https://img.shields.io/npm/v/icedfrisby-nock.svg?style=flat-square)][npm]
[![license](https://img.shields.io/npm/l/icedfrisby-nock.svg?style=flat-square)][npm]
[![build](https://img.shields.io/circleci/project/github/paulmelnikow/icedfrisby-nock.svg?style=flat-square)][build]
[![coverage](https://img.shields.io/coveralls/paulmelnikow/icedfrisby-nock.svg?style=flat-square)][coverage]
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)][prettier]

[npm]: https://npmjs.com/icedfrisby-nock
[build]: https://circleci.com/gh/paulmelnikow/icedfrisby-nock/tree/master
[coverage]: https://coveralls.io/github/paulmelnikow/icedfrisby-nock
[prettier]: https://prettier.io/

Concise support for mock requests in [IcedFrisby][].

[icedfrisby]: https://github.com/MarkHerhold/IcedFrisby/

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
frisby.create(...)
  .get(...)
  .networkOff()
  .expectJSON(...)
  .toss()
```

Mock one request, and simulate failure for any other HTTP connection.

`intercept()` automatically invokes `networkOff()`.

```js
frisby.create(...)
  .get(...)
  .intercept(nock => nock('http://example.com')
    .get('/foobar')
    .reply(200))
  .expectJSON(...)
  .toss()
```

Mock one request and allow all other HTTP connections.

```js
frisby.create(...)
  .get(...)
  .intercept(nock => nock('http://example.com')
    .get('/foobar')
    .reply(200))
  .networkOn()
  .expectJSON(...)
  .toss()
```

When using `intercept()` or `networkOff()`, the plugin restores network access
when the test finishes.

For the Nock API, refer to the [Nock docs][].

For the IcedFrisby API, refer to the [IcedFrisby docs][].

[mixwith]: https://github.com/justinfagnani/mixwith.js
[nock docs]: https://github.com/node-nock/nock#use
[icedfrisby docs]: https://github.com/MarkHerhold/IcedFrisby/blob/master/API.md

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
