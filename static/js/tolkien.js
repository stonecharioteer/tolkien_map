console.log("started!!");

var mymap = L.map('mapid');
mymap.setView([51.505, -0.09], 2);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 9,
    attribution: '',
    id: 'mapbox.streets'
}).addTo(mymap);

var p = L.marker([51.5, -0.09]).addTo(mymap)

p.bindPopup("<img src='static/images/easy_logo.png' width=30>");

// L.circle([51.508, -0.11], 500, {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5
// }).addTo(mymap).bindPopup("I am a circle.");

// L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(mymap).bindPopup("I am a polygon.");


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);

function showP() {
    mymap.setView([51.5, -0.09], 8);
    p.openPopup();
};

window.onload = function(){
                    setTimeout("showP()", 10000);
                    console.log("I have set the timer.");
                    };