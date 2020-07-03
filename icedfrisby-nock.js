'use strict'

const nock = require('nock')

function nockActivate() {
  if (!nock.isActive()) {
    nock.activate()
  }
  nock.disableNetConnect()
}

function nockCleanup() {
  nock.abortPendingRequests()
  nock.cleanAll()
  nock.restore()
}

// This is a subclass factory. It returns a constructor function (i.e., a
// Frisby subclass) with these methods added in.
//
// Read more about this pattern:
// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
const factory = superclass =>
  class IcedFrisbyNock extends superclass {
    constructor(...args) {
      super(...args)
      this.hasIntercept = false
    }

    skipIfIntercepted() {
      return this.skipWhen(() => this.hasIntercept)
    }

    // Set up intercepts. Pass in a setup function which takes one argument,
    // `nock`, and returns a nock scope. The function is invoked before the
    // test, and the returned scope is asserted afterward.
    //
    // By default, disables remote network connections (other than localhost).
    // To override this, chain on a call to `.enableNetConnect()`.
    //
    // You can only call this once per test.
    //
    // @param setup The setup function, receives `nock` and returns a nock object
    intercept(setup) {
      this.hasIntercept = true

      let nockScope

      this.before(() => {
        nockActivate()
        nockScope = setup(nock)
      })
      // https://github.com/node-nock/nock#expectations
      this.after(() => {
        nockScope.done()
      })
      this.finally(nockCleanup)

      return this
    }

    // Delegates to `intercept()` only if the condition is truthy.
    //
    // @param condition The condition on which the intercept will be set or not
    // @param setup The setup function, receives `nock` and returns a nock object
    interceptIf(condition, setup) {
      return condition ? this.intercept(setup) : this
    }

    // Disallow unexpected remote network connections by simulating failure.
    // Allows connections to localhost. Invoked automatically by `intercept()`.
    networkOff() {
      return this.before(() => {
        nockActivate()
        nock.enableNetConnect(/(localhost|127\.0\.0\.1)/)
      }).finally(() => {
        nockCleanup()
        nock.enableNetConnect()
      })
    }

    // Enable remote network connections.
    networkOn() {
      return this.before(() => {
        nockActivate()
        nock.enableNetConnect()
      }).finally(() => {
        nockCleanup()
      })
    }
  }
module.exports = factory
