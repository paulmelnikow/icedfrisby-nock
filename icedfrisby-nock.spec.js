'use strict'

const nock = require('nock')
const expect = require('chai').expect

const frisby = require('./icedfrisby-nock')(require('icedfrisby'))

describe('icedfrisby-nock', function () {
  it('sets up a mock which works correctly', function () {
    frisby.create(this.test.title)
      .post('http://example.com/test')
      .intercept(nock => nock('http://example.com')
        .post('/test')
        .reply(418, { someKey: 'someValue' }))
      .expectStatus(418)
      .expectJSON({ someKey: 'someValue' })
      .toss()
  })

  describe('when the test has finished', function () {
    frisby.create('when the test has finished')
      .post('http://example.com/test')
      .intercept(nock => nock('http://example.com')
        .post('/test')
        .reply(418, () => {
          expect(nock.activeMocks()).to.have.lengthOf(1)
          return { someKey: 'someValue' }
        }))
      .expectStatus(418)
      .expectJSON({ someKey: 'someValue' })
      .toss()

    it('removes the mock', function () {
      expect(nock.activeMocks()).to.have.lengthOf(0)
    })
  })

  it('enableNetConnect() enables network connections', function () {
    frisby.create(this.test.title)
      .post('http://example.com/test')
      .intercept(nock => nock('http://example.com')
        .post('/test')
        .reply(418, { someKey: 'someValue' }))
      .enableNetConnect()
      .after(() => {
        frisby.create(this.test.title)
          .get('http://httpbin.org')
          .expectStatus(200)
      })
      .toss()
  })
})
