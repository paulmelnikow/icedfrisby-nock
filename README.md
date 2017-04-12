icedfrisby-nock
===============

[![CircleCI](https://img.shields.io/circleci/project/github/paulmelnikow/icedfrisby-nock.svg)](https://circleci.com/gh/paulmelnikow/icedfrisby-nock)
[![Coveralls](https://img.shields.io/coveralls/paulmelnikow/icedfrisby-nock.svg)](https://coveralls.io/github/paulmelnikow/icedfrisby-nock)
[![npm](https://img.shields.io/npm/v/icedfrisby-nock.svg)](https://www.npmjs.com/package/icedfrisby-nock)
[![npm](https://img.shields.io/npm/l/icedfrisby-nock.svg)](https://www.npmjs.com/package/icedfrisby-nock)


Concise support for mock requests in [IcedFrisby][].


[IcedFrisby]: https://github.com/MarkHerhold/IcedFrisby/

Usage
-----

```js
// Compose icedfrisby with icedfrisby-nock.
const frisby = require('icedfrisby-nock')(require('icedfrisby'))

frisby.create(...)
  .get(...)
  .intercept(nock => nock('http://example.com')
    .get('/foobar')
    .reply(200)
    .enableNetConnect())
  .expectJSON(...)
  .toss()
```

- For the Nock API, refer to the [Nock docs][].
- For the IcedFrisby API, refer to the [IcedFrisby docs][].

[Nock docs]: https://github.com/node-nock/nock#use
[IcedFrisby docs]: https://github.com/MarkHerhold/IcedFrisby/blob/master/API.md


Installation
------------

```
npm install --save-dev icedfrisby nock icedfrisby-nock
```


Contribute
----------

- Issue Tracker: https://github.com/paulmelnikow/icedfrisby-nock/issues
- Source Code: https://github.com/paulmelnikow/icedfrisby-nock

Pull requests welcome!


Support
-------

If you are having issues, please let me know.


License
-------

The project is licensed under the MIT license.
