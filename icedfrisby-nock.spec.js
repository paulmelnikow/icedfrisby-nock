'use strict'

const nock = require('nock')
const expect = require('chai').expect
const fetch = require('node-fetch')
const caught = require('caught')
const { mix } = require('mixwith')

const frisby = mix(require('icedfrisby')).with(require('./icedfrisby-nock'))

describe('icedfrisby-nock', function() {
  it('sets up a mock which works correctly', function() {
    frisby
      .create(this.test.title)
      .post('http://example.com/test')
      .intercept(nock =>
        nock('http://example.com')
          .post('/test')
          .reply(418, { someKey: 'someValue' })
      )
      .expectStatus(418)
      .expectJSON({ someKey: 'someValue' })
      .toss()
  })

  describe('disables network connections', function() {
    let networkRequest

    frisby
      .create('disables network connection')
      .post('http://example.com/test')
      .intercept(nock =>
        nock('http://example.com')
          .post('/test')
          .reply(418, { someKey: 'someValue' })
      )
      .before(() => {
        process.nextTick(() => {
          networkRequest = caught(fetch('http://httpbin.org'))
        })
      })
      .toss()

    after(async function() {
      try {
        await networkRequest
        expect.fail('request should not go through')
      } catch (e) {
        const expectedMessage =
          'request to http://httpbin.org failed, reason: Nock: Disallowed net connect for "httpbin.org:80/"'
        expect(e.message).to.equal(expectedMessage)
      }
    })
  })

  describe('when the test has finished', function() {
    const itShouldReset = () => {
      it('removes the mock', function() {
        expect(nock.activeMocks()).to.have.lengthOf(0)
      })

      it('re-enables network connections', function() {
        frisby
          .create(this.test.title)
          .get('http://httpbin.org')
          .expectStatus(200)
      })
    }

    context('and succeeded', function() {
      frisby
        .create('when the test has finished and succeeded')
        .post('http://example.com/test')
        .intercept(nock =>
          nock('http://example.com')
            .post('/test')
            .reply(418, () => {
              expect(nock.activeMocks()).to.have.lengthOf(1)
              return { someKey: 'someValue' }
            })
        )
        .expectStatus(418)
        .expectJSON({ someKey: 'someValue' })
        .toss()

      itShouldReset()
    })

    context('and failed', function() {
      const test = frisby
        .create('when the test has finished and failed')
        .post('http://example.com/test')
        .intercept(nock =>
          nock('http://example.com')
            .post('/test')
            .reply(418, () => {
              expect(nock.activeMocks()).to.have.lengthOf(1)
              return { someKey: 'someValue' }
            })
        )
        .expectStatus(200)
      // Intercept the raised exception to prevent Mocha from receiving it.
      test._invokeExpects = function(done) {
        try {
          test.prototype._invokeExpects.call(test, done)
        } catch (e) {
          done()
          return
        }
        // If we catch the exeption, as expected, we should never get here.
        expect.fail('The failed expectation should have raised an exception')
      }
      test.toss()

      itShouldReset()
    })
  })

  it('networkOn() enables network connections', function() {
    frisby
      .create(this.test.title)
      .post('http://example.com/test')
      .intercept(nock =>
        nock('http://example.com')
          .post('/test')
          .reply(418, { someKey: 'someValue' })
      )
      .networkOn()
      .after(() => {
        frisby
          .create(this.test.title)
          .get('http://httpbin.org')
          .expectStatus(200)
      })
      .toss()
  })

  it('networkOff() disables network connections', function() {
    frisby
      .create(this.test.title)
      .post('http://example.com/test')
      .networkOff()
      .expectStatus(599)
      .toss()
  })
})
