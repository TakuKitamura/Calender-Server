// クライアントからのレスポンスを受け取り、適切なファイルに処理を依頼する
// 必要なファイルを読み込み
var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var server = http.createServer();

var urlParse = require('./node-lib/urlParse');


// http.createServerがrequestされたら、(イベントハンドラ)
server.on('request', function (req, res) {
  // Responseオブジェクトを作成し、その中に必要な処理を書いていき、条件によって対応させる

  var Response = {

    "renderHTML": function () {
      var contens = fs.readFile('./public/index.html', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/html'
        });

        res.write(data);
        res.end();

      });

    },

    "renderCSS": function () {
      var contens = fs.readFile('./public/css/map.css', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/css'
        });

        res.write(data);
        res.end();

      });

    },

    "programStart": function () {
      var contens = fs.readFile('./public/js/program-start.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        });

        res.write(data);
        res.end();

      });

    },

    "map": function () {
      var contens = fs.readFile('./public/js/map.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        });

        res.write(data);
        res.end();

      });

    },

    "showPlan": function () {
      var contens = fs.readFile('./public/js/show-plan.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        });

        res.write(data);
        res.end();

      });

    },

    "showRoute": function () {
      var contens = fs.readFile('./public/js/show-route.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        });

        res.write(data);
        res.end();

      });

    },

    "directionsService": function () {
      var contens = fs.readFile('./public/js/distance-matrix-service.js', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        });

        res.write(data);
        res.end();

      });

    },

    "googleApis": function () {
      var contens = fs.readFile('https://maps.googleapis.com/maps/api/js?key=AIzaSyBtrsmgpXU5pOHt30ZhkE_MttedPGsbZzw&libraries=places&callback=programStart', 'utf-8', function (err, data) {

        res.writeHead(200, {
          'content-Type': 'text/plain'
        });

        res.write(data);
        res.end();

      });

    },

    "apiServer": function (getDirectionsObj) {
      // console.log(str)
      console.log(uri + 'だよ')

      const googleMapsClient = require('./node_modules/@google/maps').createClient({
        key: 'AIzaSyBtrsmgpXU5pOHt30ZhkE_MttedPGsbZzw'
      });

      getDirectionsObj['language'] = 'ja'
      getDirectionsObj['region'] = 'JP'

      const getOriginLat = parseFloat(getDirectionsObj['origin_lat'])
      const getOriginLng = parseFloat(getDirectionsObj['origin_lng'])

      const getDestinationLat = parseFloat(getDirectionsObj['destination_lat'])
      const getDestinationLng = parseFloat(getDirectionsObj['destination_lng'])

      delete getDirectionsObj['origin_lat']
      delete getDirectionsObj['origin_lng']
      delete getDirectionsObj['destination_lat']
      delete getDirectionsObj['destination_lng']

      function add_obj(key,value) {
        getDirectionsObj[key] = value
      }

      function getOriginPlace(callback) {
        googleMapsClient.reverseGeocode({
          latlng : [getOriginLat, getOriginLng],
        },function(err,response) {
          if(!err) {

            const origin = response.json.results[0].formatted_address
            add_obj('origin',origin)

            callback(directions,origin)
          }
        })
      }

      function getDestinationPlace(callback,origin) {

        googleMapsClient.reverseGeocode({
          latlng : [getDestinationLat, getDestinationLng],
        },function(err,response) {

          if(!err) {
            // 出発時刻か、到着時刻どちらかのみ

            if( 'arrival_time' in getDirectionsObj ) {
              var arrivalTime = new Date(getDirectionsObj['arrival_time'])
              add_obj('arrival_time',arrivalTime)
            }

            if( 'departure_time' in getDirectionsObj ) {
              var departureTime = new Date(getDirectionsObj['departure_time'])
              add_obj('departure_time',departureTime)
            }


            const destination = response.json.results[0].formatted_address
            add_obj('destination',destination)

            if( getDirectionsObj['mode'] === 'transit' ) {
              add_obj('transit_mode','bus')
            }

            callback(writeJson,getDirectionsObj)

          }
        })
      }

      function directions(callback,getDirectionsObj) {
        console.log(getDirectionsObj)
        console.log(googleMapsClient.directions)

        googleMapsClient.di

        googleMapsClient.directions( getDirectionsObj,
          function(err,response) {
            console.log('HELLO')
            console.log(response)
            if(!err) {

              callback(response)
            }
          })
        }

        function writeJson(response) {
          console.log(response)

          function update(json) {
            res.writeHead(200, {
              'content-Type': 'text/json; charset=utf-8'
            });
            res.write(JSON.stringify(json))

            res.end()
          }

          var url = response.requestUrl;
          https.get(url, function(res){
          	var body = '';
          	res.setEncoding('utf8');

          	res.on('data', function(chunk){
          		body += chunk;
          	});

          	res.on('end', function(res){
          		ret = JSON.parse(body);
              console.log(ret)
              update(ret)
          	});
          }).on('error', function(e){
          	console.log(e.message); //エラー時
          });


        }

        getOriginPlace(getDestinationPlace);

      },


    };
    // urlのpathをuriに代入
    var uri = url.parse(req.url).pathname;
    // console.log(uri)


    // URIで行う処理を分岐させる
    if (uri === "/") {
      Response["renderHTML"]();
      return;
    }

    if (uri === "/css/map.css") {
      Response["renderCSS"]();
      return;
    }

    if (uri === "/js/program-start.js") {
      Response["programStart"]();
      return;
    };

    if (uri === "/js/map.js") {
      Response["map"]();
      return;
    };

    if (uri === "/js/show-plan.js") {
      Response["showPlan"]();
      return;
    };

    if (uri === "/js/show-route.js") {
      Response["showRoute"]();
      return;
    };

    if (uri === "/js/distance-matrix-service.js") {
      Response["directionsService"]();
      return;
    };

    if (uri === "https://maps.googleapis.com/maps/api/js?key=AIzaSyBtrsmgpXU5pOHt30ZhkE_MttedPGsbZzw&libraries=places&callback=programStart") {
      Response["googleApis"]();
      return;
    };

    // APIアクセスのURLチェック にテストケース
    if (/^\/api\/v1\//.test(req.url)) {

      const getDirectionsObj = urlParse.parseGetRequest(req.url)

      if( getDirectionsObj !== 'BADPARAMS' ) {
        Response["apiServer"](getDirectionsObj);
        return;
      }

      else {
        return
      }

    }

  });

  server.listen(3000)
  console.log('Server running at http://localhost:3000/');
