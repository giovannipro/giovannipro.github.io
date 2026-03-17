// basic setup ----------------------

let map = L.map('map', {
    center: [45.873673081319794, 8.979357135658603],
    zoom: 13
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    .addTo(map);


// markers ----------------------

L.marker([45.87, 8.97])
    .addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')

let circle = L.circle([45.88, 8.96], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
    })
    .addTo(map);

let polygon = L.polygon([
    [45.885, 8.965],
    [45.87, 8.97],
    [45.89, 8.98]
]).addTo(map);

// interactivity ----------------------

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

let popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);