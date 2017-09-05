
var chai = require('chai'), should = chai.should();

describe('正規表現テスト', function() {
  describe('APIアクセスのURLチェック', function() {

    const regex = /^\/api\/v1\//

    it('正しいパターン1', function() {
      const url = '/api/v1/'
      regex.test(url).should.equal(true)
    })

    it('正しいパターン2', function() {
      const url = '/api/v1/abc'
      regex.test(url).should.equal(true)
    })

    it('正しいくないパターン1', function() {
      const url = '/api/v1'
      regex.test(url).should.equal(false)
    })

    it('正しいくないパターン2', function() {
      const url = '/api/v2/abc'
      regex.test(url).should.equal(false)
    })

    it('正しいくないパターン3', function() {
      const url = '/v1/abc'
      regex.test(url).should.equal(false)
    })

    it('正しいくないパターン4', function() {
      const url = '/Api/v1/abc'
      regex.test(url).should.equal(false)
    })

    it('正しいくないパターン5', function() {
      const url = 'api/v1/abc'
      regex.test(url).should.equal(false)
    })



  })
})
