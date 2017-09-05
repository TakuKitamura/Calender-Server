// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 作成日時:2017/05/20
// 作成者:喜多村卓
// 作成ファイル名:show-plan.js
// プログラム概要:乗換案内の結果を表示。
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function showPlan(num, json, mode) {// json = routes.routes[i]

  console.log(json)

    if(mode == "TRANSIT") {
        console.log("---" + "候補" + String(num + 1) + " 所要金額 " + json.fare.value + " 円 " + "所要時間 " + json.legs[0].duration.text + "---");
        console.log("出発地 :現在地 " + "出発時刻 " + json.legs[0].departure_time.text);

        for(var i = 0; i < json.legs[0].steps.length; i++){
            // console.log(json.legs[0].steps[i])
            if(json.legs[0].steps[i].travel_mode == "WALKING") {
                console.log("↓ " + "徒歩 " + json.legs[0].steps[i].duration.text)
            }

            else if(json.legs[0].steps[i].travel_mode == "TRANSIT") {
                console.log("出発バス停 " + json.legs[0].steps[i].transit.departure_stop.name + " " + json.legs[0].steps[i].transit.headsign + " " +  json.legs[0].steps[i].transit.departure_time.text + " 発" )
                console.log("↓ " + json.legs[0].steps[i].transit.line.agencies[0].name + " " +json.legs[0].steps[i].duration.text);
                console.log("到着バス停 " + json.legs[0].steps[i].transit.arrival_stop.name + json.legs[0].steps[i].transit.arrival_time.text + " 着")
            }
        }

        console.log("到着地 :目的地" + "到着時刻" + json.legs[0].arrival_time.text);

        // document.getElementById("plan").innerHTML = planText;
    }

    else {
        console.log("---" + "候補" + String(num + 1) + " 所要時間 " + json.legs[0].duration.text + "---");
        console.log("出発地 :現在地" + " 出発時刻 "  + document.forms.departure_time.hour.value + ":" + document.forms.departure_time.minute.value);

        console.log("↓ " + "徒歩 " + json.legs[0].duration.text+ " " + json.summary)
        console.log("到着地 :目的地" + "到着時刻 " + document.forms.arrival_time.hour.value + ":" + document.forms.arrival_time.minute.value);
    }

    console.log("\n");

}
