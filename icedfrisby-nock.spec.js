'use strict'

const http = require('http')
const nock = require('nock')
const chai = require('chai')
const fetch = require('node-fetch')
const caught = require('caught')
const { mix } = require('mixwith')

chai.use(require('chai-as-promised'))
const frisby = mix(require('icedfrisby')).with(require('./icedfrisby-nock'))
const { expect } = chai

let server, port
before(async function () {
  server = http.createServer((request, response) => response.end())
  await server.listen()
  port = server.address().port
})
after(async function () {
  await server.close()
})

describe('icedfrisby-nock', function () {
  it('sets up a mock which works correctly', async function () {
    await frisby
      .create(this.test.title)
      .post('http://example.test/')
      .intercept(nock =>
        nock('http://example.test')
          .post('/')
          .reply(418, { someKey: 'someValue' })
      )
      .expectStatus(418)
      .expectJSON({ someKey: 'someValue' })
      .run()
  })

  it('sets hasIntercept to true', function () {
    const test = frisby
      .create(this.test.title)
      .post('http://example.test/')
      .intercept(nock =>
        nock('http://example.test')
          .post('/')
          .reply(418, { someKey: 'someValue' })
      )
    expect(test.hasIntercept).to.equal(true)
  })

  it('disables network connections', async function () {
    let networkRequest

    await frisby
      .create('disables network connection')
      .post('http://example.test/')
      .intercept(nock =>
        nock('http://example.test')
          .post('/')
          .reply(418, { someKey: 'someValue' })
      )
      .before(() => {
        process.nextTick(() => {
          networkRequest = caught(fetch('http://other.test'))
        })
      })
      .run()

    await expect(networkRequest).to.be.rejectedWith(
      'request to http://other.test/ failed, reason: Nock: Disallowed net connect for "other.test:80/"'
    )
  })

  describe('when the test has finished', function () {
    const itShouldReset = () => {
      it('removes the mock', function () {
        expect(nock.activeMocks()).to.have.lengthOf(0)
      })

      it('re-enables network connections', async function () {
        await frisby
          .create(this.test.title)
          .get(`http://localhost:${port}`)
          .expectStatus(200)
          .run()
      })
    }

    context('and succeeded', async function () {
      before(async function () {
        await frisby
          .create('when the test has finished and succeeded')
          .post('http://example.test/')
          .intercept(nock =>
            nock('http://example.test')
              .post('/')
              .reply(418, () => ({ someKey: 'someValue' }))
          )
          .expectStatus(418)
          .expectJSON({ someKey: 'someValue' })
          .run()
      })

      itShouldReset()
    })

    context('and failed', function () {
      before(async function () {
        const test = frisby
          .create('when the test has finished and failed')
          .post('http://example.com/test')
          .intercept(nock =>
            nock('http://example.com')
              .post('/test')
              .reply(418, () => ({ someKey: 'someValue' }))
          )
          .expectStatus(200)
        // Intercept the raised exception to prevent Mocha from receiving it.
        test._invokeExpects = function () {
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

  it('networkOn() enables network connections', async function () {
    await frisby
      .create(this.test.title)
      .post('http://example.test/test')
      .intercept(nock =>
        nock('http://example.test')
          .post('/test')
          .reply(418, { someKey: 'someValue' })
      )
      .networkOn()
      .run()

    await frisby
      .create(this.test.title)
      .get(`http://localhost:${port}`)
      .expectStatus(200)
      .run()
  })

  it('networkOff() disables network connections', async function () {
    await frisby
      .create(this.test.title)
      .post('http://example.test/')
      .networkOff()
      .expectStatus(599)
      .run()
  })

  describe('conditional intercept', function () {
    it('sets up a mock which works correctly if condition true', async function () {
      await frisby
        .create(this.test.title)
        .post('http://example.test/')
        .interceptIf(true, nock =>
          nock('http://example.test')
            .post('/')
            .reply(418, { someKey: 'someValue' })
        )
        .expectStatus(418)
        .expectJSON({ someKey: 'someValue' })
        .run()
    })

    it('does not set up a mock if condition false', async function () {
      await frisby
        .create(this.test.title)
        .get(`http://localhost:${port}`)
        .interceptIf(false, nock =>
          nock(`http://localhost:${port}`)
            .get('/')
            .reply(418, { someKey: 'someValue' })
        )
        .expectStatus(200)
        .run()
    })

    // This test requires a network connection.
    it('does sets hasIntercept to false if condition false', function () {
      const test = frisby
        .create(this.test.title)
        .get(`http://localhost:${port}`)
        .interceptIf(false, nock =>
          nock(`http://localhost:${port}`)
            .get('/')
            .reply(418, { someKey: 'someValue' })
        )
      expect(test.hasIntercept).to.equal(false)
    })
  })

  it('`skipIfIntercepted()` skips the test when it has an intercept', async function () {
    await frisby
      .create(this.test.title)
      .post('http://example.test/')
      .skipIfIntercepted()
      .intercept(() => {})
      .before(() => {
        throw Error('This should not be run')
      })
      .run()
  })
})
