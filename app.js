// クライアントからのレスポンスを受け取り、適切なファイルに処理を依頼する
// 必要なファイルを読み込み
var http = require('http')
var https = require('https')
var url = require('url')
var fs = require('fs')
var server = http.createServer()

var urlParse = require('./node-lib/urlParse')

var apiKey = 'AIzaSyDndUePQ1TWVfNQevNk6GEENmRtmpJUiHM'


// http.createServerがrequestされたら、(イベントハンドラ)
server.on('request', function (req, res) {
  // Responseオブジェクトを作成し、その中に必要な処理を書いていき、条件によって対応させる

  var Response = {

    "renderHTML": function () {
      var contens = fs.readFile('./public/index.html', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/html'
        })

        res.write(data)
        res.end()

      })

    },

    "renderCSS": function () {
      var contens = fs.readFile('./public/css/map.css', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/css'
        })

        res.write(data)
        res.end()

      })

    },

    "programStart": function () {
      var contens = fs.readFile('./public/js/program-start.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        })

        res.write(data)
        res.end()

      })

    },

    "map": function () {
      var contens = fs.readFile('./public/js/map.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        })

        res.write(data)
        res.end()

      })

    },

    "showPlan": function () {
      var contens = fs.readFile('./public/js/show-plan.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        })

        res.write(data)
        res.end()

      })

    },

    "showRoute": function () {
      var contens = fs.readFile('./public/js/show-route.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        })

        res.write(data)
        res.end()

      })

    },

    "directionsService": function () {
      var contens = fs.readFile('./public/js/distance-matrix-service.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        })

        res.write(data)
        res.end()

      })

    },

    "googleApis": function () {
      var contens = fs.readFile('https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places&callback=programStart', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        })

        res.write(data)
        res.end()

      })

    },

    "apiServer": function (getDirectionsObj) {
      // console.log(str)
      console.log(uri + 'だよ')

      const googleMapsClient = require('./node_modules/@google/maps').createClient({
        key: apiKey
      })

      getDirectionsObj['language'] = 'ja'
      getDirectionsObj['region'] = 'JP'
      getDirectionsObj['origin'] = getDirectionsObj['origin_lat'] + ', ' + getDirectionsObj['origin_lng']
      getDirectionsObj['destination'] = getDirectionsObj['destination_lat'] + ', ' + getDirectionsObj['destination_lng']

      if( 'arrival_time' in getDirectionsObj ) {
        getDirectionsObj['arrival_time'] = new Date(getDirectionsObj['arrival_time'] + ' UTC')
      }

      if( 'departure_time' in getDirectionsObj) {
        getDirectionsObj['departure_time'] = new Date(getDirectionsObj['departure_time'] + ' UTC')
      }

      if( getDirectionsObj['mode'] === 'transit' ) {
        getDirectionsObj['transit_mode'] = 'bus|subway|train|tram'
      }

      // delete getDirectionsObj['mode']
      // delete getDirectionsObj['arrival_time']
      delete getDirectionsObj['origin_lat']
      delete getDirectionsObj['origin_lng']
      delete getDirectionsObj['destination_lat']
      delete getDirectionsObj['destination_lng']

      console.log(getDirectionsObj)
      // console.log(googleMapsClient.directions)

      googleMapsClient.directions( getDirectionsObj,
        function(err,response) {
          // console.log('HELLO')
          console.log(err)
          console.log(response)
          if(!err) {
            console.log(response)
            writeJson(response)
          }
        }
      )

      function writeJson(response) {
        console.log(response)

        function update(json) {
          res.writeHead(200, {
            'content-Type': 'text/json; charset=utf-8'
          })
          res.write(JSON.stringify(json))

          res.end()
        }

        var url = response.requestUrl
        https.get(url, function(res){
          var body = ''
          res.setEncoding('utf8')

          res.on('data', function(chunk){
            body += chunk
          })

          res.on('end', function(res){
            ret = JSON.parse(body)
            // console.log(ret)
            update(ret)
          })
        }).on('error', function(e){
          console.log(e.message) //エラー時
        })


      }

    }


  }
  /*
  // urlのpathをuriに代入
  var uri = url.parse(req.url).pathname
  // console.log(uri)


  // URIで行う処理を分岐させる
  if (uri === "/") {
    Response["renderHTML"]()
    return
  }

  if (uri === "/css/map.css") {
    Response["renderCSS"]()
    return
  }

  if (uri === "/js/program-start.js") {
    Response["programStart"]()
    return
  }

  if (uri === "/js/map.js") {
    Response["map"]()
    return
  }

  if (uri === "/js/show-plan.js") {
    Response["showPlan"]()
    return
  }

  if (uri === "/js/show-route.js") {
    Response["showRoute"]()
    return
  }

  if (uri === "/js/distance-matrix-service.js") {
    Response["directionsService"]()
    return
  }

  if (uri === 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places&callback=programStart') {
    Response["googleApis"]()
    return
  }
  */

  // APIアクセスのURLチェック にテストケース
  if (/^\/api\/v1\//.test(req.url)) {

    const getDirectionsObj = urlParse.parseGetRequest(req.url)

    if( getDirectionsObj !== 'BADPARAMS' ) {
      Response["apiServer"](getDirectionsObj)
      return
    }

    else {
      return
    }

  }

})

server.listen(1072)
console.log('Server running at http://localhost:1072/')
