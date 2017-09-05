1. README.mdがあるディレクトリで、$ npm install
2. $ npm start
3. http://localhost:3000/api/v1/?origin_lat=34.990493&origin_lng=135.9637064&destination_lat=34.999493&destination_lng=135.9737064&mode=transit&arrival_time=2017-10-02T04:20:00.000Z

というような、GETリクエストで、対象のJSONを取得できる

*注意として*
arrival_time か、departure_timeは、どちらか一つのみで、日付型のもの、
最低限必要なパラメーターは、origin_lat, origin_lng, destination_lat, destination_lng です。

4. $ npm test で、test/ 以下の、テストケースを実行できる