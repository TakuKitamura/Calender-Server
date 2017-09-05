// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 作成日時:2017/05/20
// 作成者:喜多村卓
// 作成ファイル名:distance-matrix-service.js
// プログラム概要:地図とマーカーを表示と、ボタンを押した後の処理。
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// グローバス宣言

// GoogleMapが追加するマーカー
var google_markers;

// ユーザーが追加するマーカー
var user_markers;

// 地図のインスタンス
var map;


//現在地の緯度、経度を取得
function showMap() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

			// 現在の緯度
			var now_lat = position.coords.latitude;

			// 現在の経度
			var now_lng = position.coords.longitude;

			// 地図を描く範囲
			var canvas = document.getElementById("map-canvas");


			// GoogleMapのポップアップを非表示にする
			(function fixInfoWindow() {
				var set = google.maps.InfoWindow.prototype.set;
				google.maps.InfoWindow.prototype.set = function(key, val) {
					if (key === "map") {
						if (! this.get("noSuppress")) {
							return;
						}
					}
					set.apply(this, arguments);
				}
			})();

			// 地図のインスタンス
			map = new google.maps.Map(canvas,
				{
					zoom: 15,
					center: new google.maps.LatLng(now_lat,now_lng),
					mapTypeId: "roadmap"
				});

				// 検索ボックス作成
				var input = document.getElementById("pac-input");
				var searchBox = new google.maps.places.SearchBox(input);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

				// 地図の表示範囲が切り替わった時のイベントハンドラ
				map.addListener("bounds_changed", function() {

					// 地図の表示範囲を変更
					searchBox.setBounds(map.getBounds());
				});

				// マーカー保存用
				google_markers = [];
				user_markers = [];

				// 検索ボックスでユーザーが場所入力しEnterで検索した時のイベントハンドラ
				searchBox.addListener("places_changed", function() {

					// 検索結果に出てきた、複数の場所を保存
					var places = searchBox.getPlaces();

					// 検索されたものが空の時は何もしない
					if (places.length == 0) {
						return;
					}

					// 検索結果で出たマーカーを削除
					google_markers.forEach(function(google_marker) {
						google_marker.setMap(null);
					});

					// 左クリックして出たマーカーを削除
					user_markers.forEach(function(user_marker) {
						user_marker.setMap(null);
					});

					// 地図の表示範囲に関するインスタンス
					var bounds = new google.maps.LatLngBounds();

					// 複数の場所全てに対して処理する
					places.forEach(function(place) {
						if (!place.geometry) {
							console.log("Returned place contains no geometry");
							return;
						}

						// 検索結果に出た複数場所にマーカーを配置
						google_markers.push(new google.maps.Marker({
							map: map,
							title: place.name,
							position: place.geometry.location
						}));


						// 検索した場所が広範囲かそうでないか判定
						if (place.geometry.viewport) {

							// 例えば東京タワーならそこを地図に表示
							bounds.union(place.geometry.viewport);
						}
						else {

							// 例えば滋賀県なら全体を見れるような縮尺で地図を表示
							bounds.extend(place.geometry.location);
						}
					});

					// 検索した結果でた、マーカーに対する処理
					google_markers.forEach(function(google_marker) {

						// 検索した結果でた、マーカーを左クリックした時の処理
						google.maps.event.addListener(google_marker,"click",function(data) {

							// 左クリックした場所のマーカーを削除
							user_markers.forEach(function(user_marker) {
								user_marker.setMap(null);
							});

							// 左クリックした場所にマーカーを立てる
							user_markers.push(new google.maps.Marker({
								map: map,
								title: "target_place",
								position: data.latLng
							}));

							// 現在地から、最後にクリックしたマーカーの場所までの所要時間などを調べる
							getRequiredTime();
						});

					});



					// 地図表示の設定を反映
					map.fitBounds(bounds);
				});

				// 左クリックしたときの処理
				map.addListener("click",function(data) {

					var user_markers_size = user_markers.length;

					// 左クリックした場所のマーカーを削除
					user_markers.forEach(function(user_marker) {
						user_marker.setMap(null);
					});

					// 左クリックをした座標にマーカーを立てる
					user_markers.push(new google.maps.Marker( {

						// 指定の画像をマーカーにする
						icon: "http://maps.google.com/mapfiles/ms/micons/grn-pushpin.png",
						map: map,
						title: "target_place",
						position: data.latLng
					}));

					// 現在地から、最後にクリックしたマーカーの場所までの所要時間などを調べる
					getRequiredTime();

				});

				// 現在地から、最後にクリックしたマーカーの場所までの所要時間などを調べる
				function getRequiredTime(){

					// ユーザーが追加するマーカーのサイズ
					var user_markers_size = user_markers.length;

					// マーカーの緯度、経度を取得
					var marker_lat = user_markers[user_markers_size - 1].getPosition().lat();
					var marker_lng = user_markers[user_markers_size - 1].getPosition().lng();

					var modeList = document.getElementsByName("method");

					var mode = "DRIVING"

					// 目的地までの使用する手段をラジオボタンから調べる
					for(var i = 0; i < modeList.length; i++) {
						if(modeList[i].checked) {
							mode = String(modeList[i].value);
							break;
						}
					}

					// 所要時間などのデータを取得
					getDistanceMatrixData(now_lat,now_lng,marker_lat,marker_lng,mode);
				}


			});

		}

		else {
			console.log("現在地取得エラー");
			return 0;
		}
	}
