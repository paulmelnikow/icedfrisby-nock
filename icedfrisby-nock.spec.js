'use strict'

const nock = require('nock')
const chai = require('chai')
const fetch = require('node-fetch')
const caught = require('caught')
const { mix } = require('mixwith')

chai.use(require('chai-as-promised'))
const frisby = mix(require('icedfrisby')).with(require('./icedfrisby-nock'))
const { expect } = chai

describe('icedfrisby-nock', function() {
  it('sets up a mock which works correctly', async function() {
    await frisby
      .create(this.test.title)
      .post('http://example.com/test')
      .intercept(nock =>
        nock('http://example.com')
          .post('/test')
          .reply(418, { someKey: 'someValue' })
      )
      .expectStatus(418)
      .expectJSON({ someKey: 'someValue' })
      .run()
  })

  it('disables network connections', async function() {
    let networkRequest

    await frisby
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
      .run()

    expect(networkRequest).to.be.rejectedWith(
      'request to http://httpbin.org/ failed, reason: Nock: Disallowed net connect for "httpbin.org:80/"'
    )
  })

  describe('when the test has finished', function() {
    const itShouldReset = () => {
      it('removes the mock', function() {
        expect(nock.activeMocks()).to.have.lengthOf(0)
      })

      it('re-enables network connections', async function() {
        await frisby
          .create(this.test.title)
          .get('http://httpbin.org')
          .expectStatus(200)
          .run()
      })
    }

    context('and succeeded', async function() {
      beforeEach(async function() {
        await frisby
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
          .run()
      })

      itShouldReset()
    })

    context('and failed', function() {
      beforeEach(async function() {
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
        test._invokeExpects = function() {
          try {
            test.prototype._invokeExpects.call(test)
          } catch (e) {
            return
          }
          // If we catch the exeption, as expected, we should never get here.
          expect.fail('The failed expectation should have raised an exception')
        }
        await test.run()
      })

      itShouldReset()
    })
  })

  it('networkOn() enables network connections', async function() {
    await frisby
      .create(this.test.title)
      .post('http://example.com/test')
      .intercept(nock =>
        nock('http://example.com')
          .post('/test')
          .reply(418, { someKey: 'someValue' })
      )
      .networkOn()
      .run()

    await frisby
      .create(this.test.title)
      .get('http://httpbin.org')
      .expectStatus(200)
      .run()
  })

  it('networkOff() disables network connections', async function() {
    await frisby
      .create(this.test.title)
      .post('http://example.com/test')
      .networkOff()
      .expectStatus(599)
      .run()
  })

  describe('conditional intercept', function() {
    it('sets up a mock which works correctly if condition true', async function() {
      await frisby
        .create(this.test.title)
        .post('http://example.com/test')
        .interceptIf(true, nock =>
          nock('http://example.com')
            .post('/test')
            .reply(418, { someKey: 'someValue' })
        )
        .expectStatus(418)
        .expectJSON({ someKey: 'someValue' })
        .run()
    })

    it('does not set up a mock if condition false', async function() {
      await frisby
        .create(this.test.title)
        .get('http://httpbin.org')
        .interceptIf(false, nock =>
          nock('http://httpbin.org')
            .get('/')
            .reply(418, { someKey: 'someValue' })
        )
        .expectStatus(200)
        .run()
    })
  })
})
