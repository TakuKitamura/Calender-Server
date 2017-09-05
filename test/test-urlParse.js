var urlParse = require('../node-lib/urlParse');

var chai = require('chai'), should = chai.should();

describe('URLパースのテスト', function() {
  describe('GETリクエストの、パラメーターの取得チェック', function() {

    it('受け取るパラメーターが一つのとき', function() {
      const url = 'http://localhost3000/api/v1/?origin_lat=35.9904905'

      urlParse.parseGetRequest(url)['origin_lat'].should.equal('35.9904905')
    })

    it('受け取るパラメーターが二つのとき', function() {
      const url = 'http://localhost3000/api/v1/?origin_lat=35.9904905&origin_lng=135.97368660000004'

      urlParse.parseGetRequest(url)['origin_lat'].should.equal('35.9904905')
      urlParse.parseGetRequest(url)['origin_lng'].should.equal('135.97368660000004')
    })

    it('受け取るパラメーターが三つのとき', function() {
      const url = 'http://localhost3000/api/v1/?origin_lat=35.9904905&origin_lng=135.97368660000004&destination_lat=35.170915'

      urlParse.parseGetRequest(url)['origin_lat'].should.equal('35.9904905')
      urlParse.parseGetRequest(url)['origin_lng'].should.equal('135.97368660000004')
      urlParse.parseGetRequest(url)['destination_lat'].should.equal('35.170915')
    })

    it('受け取るパラメーターがNULLのとき', function() {
      const url = 'http://localhost3000/api/v1/'

      urlParse.parseGetRequest(url).should.equal('BADPARAMS')
    })

    it('受け取るパラメーターが空文字のとき', function() {
      const url = 'http://localhost3000/api/v1/?'

      urlParse.parseGetRequest(url).should.equal('BADPARAMS')
    })

    it('受け取るパラメーターに、有効なキーが存在しないとき', function() {
      const url = 'http://localhost3000/api/v1/?id=bamboo'
      urlParse.parseGetRequest(url).should.equal('BADPARAMS')
    })

    it('受け取るパラメーターに、有効でないキーが複数存在するとき', function() {
      const url = 'http://localhost3000/api/v1/?id=bamboo&password=ber'
      urlParse.parseGetRequest(url).should.equal('BADPARAMS')
    })

    it('受け取るパラメーターに、有効なキーと有効でないキーが存在するとき', function() {
      const url = 'http://localhost3000/api/v1/?origin=Washington,DC&id=bambo'
      urlParse.parseGetRequest(url).should.equal('BADPARAMS')
    })

    it('受け取るパラメーターに、有効なキーは存在するが、値が存在しないとき', function() {
      const url = 'http://localhost3000/api/v1/?origin'
      urlParse.parseGetRequest(url).should.equal('BADPARAMS')
    })

    it('受け取るパラメーターに、値が存在しないものも含まれるとき', function() {
      const url = 'http://localhost3000/api/v1/?origin=Washington,DC&destinations'
      urlParse.parseGetRequest(url).should.equal('BADPARAMS')
    })

    it('受け取るパラメーターに、キーも値も存在しないとき', function() {
      const url = 'http://localhost3000/api/v1/?origin=Washington,DC&&destinations=New+York+City'
      urlParse.parseGetRequest(url).should.equal('BADPARAMS')
    })
  })
})
