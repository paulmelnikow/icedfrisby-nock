icedfrisby-nock
===============

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
```


Installation
------------

```
npm install --save-dev icedfrisby icedfrisby-nock
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
