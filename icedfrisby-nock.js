'use strict'

const nock = require('nock')

// This is a subclass factory. It returns a constructor function (i.e., a
// Frisby subclass) with these methods added in.
//
// Read more about this pattern, and see what it looks like in ES6:
// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
const Factory = function (superClassIsh) {
  let superClass, statics
  if ((typeof superClassIsh) !== 'function') {
    // Handle IcedFrisby which does not expose its constructor.
    statics = superClassIsh
    superClass = superClassIsh.create().constructor
  } else {
    statics = superClass = superClassIsh
  }

  const FrisbyNock = function () {
    superClass.apply(this, arguments)
  }

  // Transfer all statics from super, then override some.
  Object.assign(FrisbyNock, statics)
  FrisbyNock.prototype = Object.create(superClass.prototype)
  delete FrisbyNock.version
  FrisbyNock.create = function (msg) {
    return new FrisbyNock(msg)
  }

  // Set up intercepts. Pass in a setup function which takes one argument,
  // `nock`, and returns an interceptor. The function is invoked before the
  // test, and the returned interceptor is cleaned up afterward.
  //
  // In the future: By default, disables remote network connections (other
  // than localhost). To override this, chain on a call to
  // `.enableNetConnect()`. This is currently disabled because there isn't
  // a reliable way to clean it up.
  //
  // You can only call this once per test.
  //
  // @param setup The setup function, receives `nock` and returns a nock object
  FrisbyNock.prototype.intercept = function (setup) {

    // Work around a limitation in IcedFrisby that prevents reliably
    // cleaning up in `after` callbacks.
    this.before(() => { nock.cleanAll() })

    // This is a bad idea right now, since there isn't a way to clean it up.
    // this.before(function () {
    //   nock.disableNetConnect()
    //   nock.enableNetConnect(/(localhost|127\.0\.0\.1)/)
    // })

    let interceptor
    this.before(() => { interceptor = setup(nock) })

    // Due to a limitation in IcedFrisby, this isn't called reliably.
    // https://github.com/MarkHerhold/IcedFrisby/issues/27#issuecomment-292600587
    this.after(() => {
      if (interceptor) {
        nock.removeInterceptor(interceptor)
      }
    })

    return this
  }

  // Enable remote network connections.
  FrisbyNock.prototype.enableNetConnect = function (matcher) {
    nock.enableNetConnect(matcher)
  }

  return FrisbyNock
}
module.exports = Factory
