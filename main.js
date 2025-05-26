"use strict"

const map = L.map(document.getElementById("map"));
map.setView([35.3622222, 138.7313889], 5);
L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
  attribution: "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\" target=\"_blank\">地理院タイル</a>"
}).addTo(map);

var mantelas;

document.getElementById("formMantela").addEventListener("submit", async (e) => {
    e.preventDefault();

    btnGenerate.disabled = true;
    const start = performance.now();
    outputStatus.textContent = "";
    const mantelas = checkNest.checked
		? await fetchMantelas2(urlMantela.value, +numNest.value)
		: await fetchMantelas2(urlMantela.value)
    const stop = performance.now();
    outputStatus.textContent = `Done. (${stop - start} ms)`;
    btnGenerate.disabled = false;

    var extensions = [];
    var pbxs = [];
    mantelas.forEach((mantela) => {
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

    mantelas.forEach((mantela) => {
      mantela.mantela.extensions.forEach((extension) => {
        extensions.push(extension);
      });
    });
    extensions.filter((extension)=>{
      if (extension.geolocationCoordinates != undefined) {
        console.log(extension)
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
});
