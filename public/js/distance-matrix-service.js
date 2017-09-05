// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 作成日時:2017/05/20
// 作成者:喜多村卓
// 作成ファイル名:distance-matrix-service.js
// プログラム概要:所要時間などのデータをGoogleMap APIを用いて取得する。
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// 所要時間などのデータを取得
function getDistanceMatrixData(now_lat,now_lng,marker_lat,marker_lng,mode) {

    // 緯度、経度から住所生成する
    // 出発地点
    var origin = new google.maps.LatLng(now_lat,now_lng);

    console.log(now_lat,now_lng)
    //目的地点
    var destination = new google.maps.LatLng(marker_lat,marker_lng);

    var arrivalTimeForm = document.forms.arrival_time;
    var departureTimeForm = document.forms.departure_time;

    var departureTime = new Date(
        departureTimeForm.year.value,
        departureTimeForm.month.value,
        departureTimeForm.day.value,
        departureTimeForm.hour.value,
        departureTimeForm.minute.value
    );

    var arrivalTime = new Date(
        arrivalTimeForm.year.value,
        arrivalTimeForm.month.value,
        arrivalTimeForm.day.value,
        arrivalTimeForm.hour.value,
        arrivalTimeForm.minute.value
    );

    //DistanceMatrixServiceのインスタンス
    var service = new google.maps.DistanceMatrixService();

    // var modes = "BUS"

    // 自転車が交通手段として選ばれた時
    if(mode == "BICYCLING"){
        var bicycling = true;
        mode = "WALKING"
    }

    else {
        var bicycling = false;
    }

    service.getDistanceMatrix(

        // パラメータ
        {
            origins: [origin],
            destinations: [destination],
            travelMode: mode,
            transitOptions: {
                arrivalTime: arrivalTime,
                departureTime: departureTime,
                modes: ["BUS"]
            }
        }, writeResults);

        // JSONのデータ処理
        function writeResults(response, status) {
            console.log(response)
            if (status == "OK") {
                var origins = response.originAddresses;

                var destinations = response.destinationAddresses;

                for (var i = 0; i < origins.length; i++) {
                    var results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                        var element = results[j];
                        var distance = element.distance.text;

                        var duration = element.duration.text;

                        // 自転車が交通手段として選ばれた時
                        if(bicycling) {

                            // 自転車の平均速度、時速14.6kmで計算

                            // 単位:日
                            var day = 0;

                            // 単位:時　ここの段階では 24.5時間などもある
                            var hour = element.distance.value / 14600;

                            // 単位:分
                            var min = 0;

                            // 所要時間が1時間以上の時
                            if(hour >= 1) {

                                // round:四捨五入
                                // floor:切り捨て

                                // 単位:分
                                min = Math.round((hour - Math.floor(hour)) * 60);

                                // 単位:時
                                hour = Math.round(hour - (min / 60.0));

                                // 所要時間が1日以上のとき
                                if(hour >= 24){

                                    // 単位:日
                                    day = Math.floor(hour / 24);

                                    // 単位:時間
                                    hour = (hour % 24) + Math.round(min / 60.0);

                                    if(hour == 24){
                                        day = day + 1;
                                        hour = hour - 24;
                                    }


                                    duration = String(day) + "日" + String(hour) + "時間";

                                }

                                // 所要時間が1日以下の時
                                else {
                                    duration = String(hour) + "時間" + String(min) + "分";
                                }

                            }

                            // 所要時間が1時間以下の時
                            else {
                                min = Math.round(hour * 60);

                                // 最小1分以下の時は最低1分にする
                                if(min < 1) {
                                    min = 1;
                                }

                                // 自転車が交通手段として選ばれた時
                                duration = String(min) + "分";

                            }

                        }

                        // 住所にUnnamed_Roadがある場合の処理
                        function when_unnamed_road(address) {

                            // この文字を含む時の処理
                            if(address.match(/Unnamed Road/)) {
                                var split_address = address.split(" ");
                                var split_address_size = split_address.length;
                                address
                                = "";

                                for(var i = split_address_size - 1; i >= 2; i--) {

                                    if(i == split_address_size - 2 && split_address[i].match(/-/)) {
                                        address += "〒";
                                    }

                                    address += split_address[i];

                                    if(i == split_address_size - 1) {
                                        address += ",";
                                    }

                                    address += " ";


                                }

                                return address;

                            }

                            else {
                                return address;
                            }

                        }

                        var from = when_unnamed_road(origins[i]);
                        var to = when_unnamed_road(destinations[j]);


                        var text1 = "現在地：" + from;
                        var text2 = "目的地：" + to;
                        // var text3 = "距離：" + distance;
                        // var text4 = "所要時間：" + duration;

                        // 結果書き込み
                        document.getElementById("text1").innerHTML = text1;
                        document.getElementById("text2").innerHTML = text2;
                        // document.getElementById("text3").innerHTML = text3;
                        // document.getElementById("text4").innerHTML = text4;
                        showRoute(origin, destination, arrivalTime, departureTime, mode);
                    }
                }
            }
        }
    }
