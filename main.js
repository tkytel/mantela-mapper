
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

    var terminals = [];
    var pbxs = [];
    mantelas.forEach((entry) => {
        pbxs.push(entry.mantela.aboutMe);
    });
    pbxs = pbxs.filter((aboutMe) => {
      if (aboutMe.geolocationCoordinates != undefined) {
        return true;
      }
      return false;
    });
    pbxs.forEach((aboutMe) => {
      var marker = L.marker([aboutMe.geolocationCoordinates.latitude, aboutMe.geolocationCoordinates.longitude]).addTo(map);
      marker.bindPopup(aboutMe.name, {autoclose: false});
    });
});
