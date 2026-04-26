// basic setup ----------------------
// --------------------------------------------------------

const map = L.map('map', {
    center: [45.870673, 8.979357],
    zoom: 13,
    // minZoom: 0,
    // maxZoom: 17
    // zoomSnap: 0.25
});

// OSM
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})
.addTo(map);

// CartoDB Positron (minimalista/chiara) 
// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
//     attribution: '© CartoDB'
// })

// CartoDB Dark Matter (tema scuro)
// L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
//     attribution: '© CartoDB'
// })

// Esri World Imagery (satellite)
// L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//     attribution: '© Esri'
// })


// markers and other visual elements ----------------------
// --------------------------------------------------------

const marker = L.marker([45.870, 8.979])
    .bindPopup('Questo è un popup')
    .addTo(map)

const circle = L.circle([45.88, 8.95],{
    radius: 500
})
.bindTooltip('Questo è un tooltip')
// , {
//     direction: 'top',
//     offset: [0, -40]
// })
.addTo(map);

const polygon = L.polygon([
    [45.885, 8.965],
    [45.87, 8.97],
    [45.89, 8.98]
], {
    color: 'blue',
    fillColor: 'transparent',
    fillOpacity: 0.5
})
.addTo(map);

// import GeoJSON data ----------------------
// --------------------------------------------------------

// fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
// fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
// fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson')
fetch('assets/data/all_week.json')
    .then(response => response.json())
    .then(data => {
        displayData(data)
    })
    .catch(err => console.error('Errorr: ', err));

function displayData(data){
    console.log(data)

    const markersGroup = L.featureGroup().addTo(map);

    data.features.forEach(function(feature) {

        const coords = feature.geometry.coordinates;

        // if (feature.properties.mag != undefined && feature.properties.mag > 0){
        //     size = Math.sqrt(feature.properties.mag) * 2
        // } 

        size = 5

        const bubble = L.circleMarker([coords[1], coords[0]], { // coords[1], coords[0]
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.5,
            radius: size
        })
        .bindTooltip(feature.properties.place + ', ' + feature.properties.mag)

        bubble.on('click', function() {
            window.open(feature.properties.url, '_blank');
        });

        markersGroup.addLayer(bubble);

    })

    map.fitBounds(markersGroup.getBounds());
}


// get user position
// --------------------------------------------------------

// map.locate({ setView: true, maxZoom: 16 });

// map.on('locationfound', function(e) {
//     L.marker(e.latlng)
//         .addTo(map)
//         .bindPopup("Sei qui!")
//         .openPopup();
// });

// map.on('locationerror', function(e) {
//     console.error(e.message);
// });