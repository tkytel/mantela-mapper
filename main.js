"use strict"

const map = L.map(document.getElementById("map"));
map.setView([35.3622222, 138.7313889], 5);
L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
  attribution: "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\" target=\"_blank\">地理院タイル</a>"
}).addTo(map);


document.getElementById("formMantela").addEventListener("submit", async (e) => {
    e.preventDefault();

    // エラー欄を全消去します
    const cloneOutputError = outputError.cloneNode(false);
    outputError.parentNode.replaceChild(cloneOutputError, outputError);
    summaryError.textContent = "エラー情報"

    outputStatus.textContent = "";
    btnGenerate.disabled = true;
    const start = performance.now();
    const request = checkNest.checked
		? await fetchMantelas3(urlMantela.value, {maxDepth: +numNest.value})
		: await fetchMantelas3(urlMantela.value)
    const stop = performance.now();
    outputStatus.textContent = `Done. (${stop - start} ms)`;
    btnGenerate.disabled = false;

    var extensions = [];
    var pbxs = [];
    request.mantelas.forEach((mantela) => {
        pbxs.push(mantela.mantela.aboutMe);
    });

    pbxs.filter((aboutMe) => {
      if (aboutMe.geolocationCoordinates != undefined) {
        return true;
      }
      return false;
    })
    .forEach((aboutMe) => {
      var marker = L.marker([aboutMe.geolocationCoordinates.latitude, aboutMe.geolocationCoordinates.longitude]).addTo(map);
      marker.bindPopup(
        `[局] ${aboutMe.name}<br>`
        +`緯度: ${aboutMe.geolocationCoordinates.latitude}<br>`
        +`経度: ${aboutMe.geolocationCoordinates.longitude}`, {autoclose: false});
    });

    request.mantelas.forEach((mantela) => {
      mantela.mantela.extensions.forEach((extension) => {
        extensions.push(extension);
      });
    });
    extensions.filter((extension)=>{
      if (extension.geolocationCoordinates != undefined) {
        return true;
      }
      return false;
    })
    .forEach((extension)=>{
      var marker = L.marker([extension.geolocationCoordinates.latitude, extension.geolocationCoordinates.longitude]).addTo(map);
      marker.bindPopup(
        `[端末] ${extension.name}<br>`
        +`緯度: ${extension.geolocationCoordinates.latitude}<br>`
        +`経度: ${extension.geolocationCoordinates.longitude}`, {autoclose: false});
    })

    summaryError.textContent = `エラー情報（${request.errors.length}件）`
    request.errors.forEach((error) => {
      const dt = document.createElement("dt");
      dt.textContent = error.message;

      const ddNameMesg = document.createElement("dd");
      ddNameMesg.textContent = {
        TypeError:
          "Mantela.json の取得に失敗した可能性があります"
          +"（CORS の設定や HTTP ヘッダを確認してみてください）",
        Error:
          "Mantela.json の取得に失敗した可能性があります"
          +"（正しい URL であるか確認してみてください）",
        SyntaxError:
          "Mantela.json の取得に失敗した可能性があります"
          +"（書式に問題がないか確認してみてください）",
        AbortError:
          "Mantela.json の取得に失敗した可能性があります"
          +"（ネットワークの状態を確認してみてください）"
      }[error.cause.name];

      const ddCause = document.createElement("dd");
		  ddCause.textContent = String(error.cause);

      cloneOutputError.append(dt, ddNameMesg, ddCause);
    })

});

/*
 * hops のパラメータが指定されているときは自動入力してチェックボックスに印を付ける
 */
const urlSearch = new URLSearchParams(document.location.search);
if (urlSearch.get('hops')) {
  numNest.value = urlSearch.get('hops');
  checkNest.checked = true;
}
/*
 * first のパラメータが指定されているときは自動入力して表示する
 */
if (urlSearch.get('first')) {
  urlMantela.value = urlSearch.get('first');
  btnGenerate.click();
}
