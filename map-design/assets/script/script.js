let map = L.map('map')
    .setView([45.873673081319794, 8.979357135658603], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    .addTo(map);

L.marker([45.87, 8.97])
    .addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    // .openPopup();

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

let popup = L.popup()
    .setLatLng([45.87, 8.965])
    .setContent("I am a standalone popup.")
    .openOn(map);