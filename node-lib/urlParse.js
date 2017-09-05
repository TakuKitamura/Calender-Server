
exports.parseGetRequest = function(urlStr) {
  var url = require('url')

  if(!url.parse(urlStr).query) {
    return 'BADPARAMS'
  }

  const paramsObj = {}
  const params = url.parse(urlStr).query.split('&')
  const paramsSize = params.length
  const apiKeyList =
  {
    'mode' : 1,
    'departure_time' : 2,
    'arrival_time' : 3,
    'transit_mode' : 4,
    'origin_lat' : 5,
    'origin_lng' : 6,
    'destination_lat' : 7,
    'destination_lng' : 8,
    'language' : 9,
    'region' : 10,
  }

  for( var i = 0; i <= paramsSize; i++ ) {
    if(params[i] !== undefined){

      const param = params[i].split('=')

      if(!param[1]) {
        return 'BADPARAMS'
      }

      if(param[0] in apiKeyList) {
        paramsObj[param[0]] = param[1]
      }

      else {
        return 'BADPARAMS'
      }

    }
  }

  return paramsObj

};
