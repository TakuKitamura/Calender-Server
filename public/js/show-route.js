/*
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
作成日時:2017/06/04
作成者:湯川大雅
作成ファイル名:show-route.js
プログラム概要:ルート情報を取得し、ルートの選択肢を表示、地図上に描画する。
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/

/*ルート取得用*/
var directionsService = undefined;

/*ルート描画用*/
var directionsDisplay = undefined;

/*ルートの候補を覚えておく変数*/
var routes = undefined;

function showRouteInit(){
	/*ルート取得・表示に関する初期設定
	引数：無し
	返り値：無し
	*/

	/*ルート取得用*/
	directionsService = new google.maps.DirectionsService();

	/*ルート描画用*/
	directionsDisplay = new google.maps.DirectionsRenderer({
		//draggable: true,
		suppressMarkers : true
	});

	directionsDisplay.setMap(map)
}

function radioChanged(x){
	/*選ばれたルートを地図に反映させる。
	引数：選ばれたルートの添字
	返り値：無し
	*/

	/*表示するルートの情報*/
	var request = {
		geocoded_waypoints: routes.geocoded_waypoints,
		routes: [routes.routes[x]], /*選ばれたルートのみに限定*/
		status: routes.status,
		request: routes.request
	};

	/*地図に反映*/
	directionsDisplay.setDirections(request);
}


function showRouteList(mode){
	/*ルートの候補を一覧を表示する。
	引数：無し
	返り値：無し
	*/

	/*表示する場所を指定*/
	var listBase = document.getElementById("route-list");

	/*過去の情報が残っている場合は、表示を消す。*/
	for(var i = listBase.childNodes.length-1; i>=0; i--){
		listBase.removeChild(listBase.childNodes[i]);
	}

	/*ルート候補の数だけ繰り返す*/
	/*listBase > (div > label > input) * (length-1) になる*/
	for(var i = 0; i < routes.routes.length; i++){

		/*ルート情報をインデックスごとにまとめるdiv*/
		var newDiv = document.createElement("div");
		newDiv.id = "route-info-" + i;

		/*ルート情報の概要の表示と、ラジオボタンを関連づけるlabel*/
		var newLabel = document.createElement("label");

		/*ルートを選択できるようにするラジオボタン*/
		var newRadio = document.createElement("input");
		newRadio.type = "radio";
		newRadio.name = "route-radio";
		newRadio.setAttribute("onChange", "radioChanged(" + i + ")");
		/*先頭要素だけ選択済みにする*/
		if(!i) newRadio.checked = "checked";

		/*ラジオボタンと、ルート情報の文字列をlabelに収める*/
		/* label > radio + text */
		newLabel.appendChild(newRadio);
		// console.log(JSON.stringify(routes.routes[i]))
		// console.log(routes.routes[i])

		// ルートに関する全ての情報を入れる
		var routeInformation = "";

		console.log(routes.routes[i])

		showPlan(i ,routes.routes[i], mode);


		if(mode == "TRANSIT" && routes.routes[i].summary == "") {
			routeInformation += "バス"
		}

		else {
			routeInformation += routes.routes[i].summary
		}

		routeInformation +=
		"(" +
		routes.routes[i].legs[0].distance.text + /*距離*/
		" / " +
		routes.routes[i].legs[0].duration.text + /*時間*/
		")"


		newLabel.appendChild(document.createTextNode(
			// routes.routes[i].summary　/*概要*/
			// + "(" + routes.routes[i].legs[0].distance.text + " / "　/*距離*/
			// + routes.routes[i].legs[0].duration.text + ")"　/*時間*/
			routeInformation
		));

		/* listBase > div > label */
		newDiv.appendChild(newLabel);
		listBase.appendChild(newDiv);
	}

	/*先頭要素を選択したことにする*/
	radioChanged(0);
}


function showRoute(origin, destination, arrivalTime, departureTime, mode){
	/*経路情報を取得、描画します。
	引数：origin = 出発地点(LatLng), destination = 目的地点(LatLng),  mode = 交通手段(string)
	返り値：無し
	*/

	//初回呼び出しのみ実行
	if(typeof directionsService === "undefined" || typeof directionsDisplay === "undefined"){
		showRouteInit();
	}

	/*投げるリクエスト*/
	var request = {
		origin : origin,
		destination: destination,
		travelMode: mode,
		provideRouteAlternatives: true,
		transitOptions: {
			arrivalTime: arrivalTime,
			departureTime: departureTime,
			modes: ["BUS"]
		}
	};

	/*ルート取得*/
	directionsService.route(request, function(response, status){
		console.log(response)
		if(status === "OK"){ /*正常ならルートの候補を表示*/

			/*ルート候補を覚えておく*/
			routes = response;

			/*ルートの候補の一覧を表示*/
			showRouteList(mode);

		}else{
			console.log("ルート取得時にエラー" + status);
		}
	});

}
