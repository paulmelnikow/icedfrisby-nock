'use strict'

const nock = require('nock')

// This is a subclass factory. It returns a constructor function (i.e., a
// Frisby subclass) with these methods added in.
//
// Read more about this pattern:
// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
const factory = superclass =>
  class IcedFrisbyNock extends superclass {
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
      let nockScope

      this.before(() => {
        nockScope = setup(nock)
      })
      // https://github.com/node-nock/nock#expectations
      this.after(() => {
        nockScope.done()
      })
      this.finally(() => {
        nock.cleanAll()
      })

      this.networkOff()

      return this
    }

    // Delegates to `intercept()` only if the condition evaluates to `true`.
    //
    // @param condition The condition on which the intercept will be set or not
    // @param setup The setup function, receives `nock` and returns a nock object
    conditionalIntercept(condition, setup) {
        return condition === true ? this.intercept(setup) : this
    }

    // Disallow unexpected remote network connections by simulating failure.
    // Allows connections to localhost. Invoked automatically by `intercept()`.
    networkOff() {
      this.before(() => {
        nock.enableNetConnect(/(localhost|127\.0\.0\.1)/)
      })
      this.finally(() => {
        nock.enableNetConnect()
      })
      return this
    }

    // Enable remote network connections.
    networkOn() {
      this.before(() => {
        nock.enableNetConnect()
      })
      return this
    }
  }
module.exports = factory
