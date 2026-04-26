// proiezioni ----------------------

// console.log(L.Proj);

// let crs = new L.Proj.CRS('EPSG:3006',
//   '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
//   {
//     resolutions: [
//       8192, 4096, 2048, 1024, 512, 256, 128
//     ],
//     origin: [0, 0]
//   })

// let crs = new L.Proj.CRS(
//   'EPSG:4326',
//   '+proj=longlat +datum=WGS84 +no_defs',
//   {
//     resolutions: [1, 0.5, 0.25, 0.125]
//   }
// );


// basic setup ----------------------

const map = L.map('map', {
    // renderer: L.canvas(),
    center: [45.870673, 8.979357],
    zoom: 13,
    minZoom: 0,
    maxZoom: 20
});

// let wmsLayer = L.tileLayer.wms(
//   "https://wmts.geo.admin.ch/EPSG/4326/1.0.0/WMTSCapabilities.xml",
//   {
//     layers: "TOPO-OSM-WMS"
//   }
// );


// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
// L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
// L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
// L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
// L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
// L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CartoDB'
    })
    .addTo(map);


// // markers ----------------------

let marker1 = L.marker([45.870, 8.979])
    .bindPopup('Questo è un popup')
    .addTo(map)

// let marker2 = L.marker([45.86, 8.96])
//     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
//     // .addTo(map)

// let circle = L.circle([45.88, 8.96], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
//     })
//     .addTo(map);

// let polygon = L.polygon([
//     [45.885, 8.965],
//     [45.87, 8.97],
//     [45.89, 8.98]
//     ])
//     .addTo(map);

// layers ----------------------

// let layer = L.featureGroup([marker1, marker2])
// layer.addTo(map);
// // console.log(layer)

// // map.fitBounds(layer.getBounds());


// // import GeoJSON data ----------------------

// let geojsonData;
// let markersGroup = L.featureGroup().addTo(map);

// fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
// // fetch('assets/data/ne_110m_populated_places.geojson')
// // fetch('assets/data/data.json')
//     .then(response => response.json())
//     .then(data => {
//         geojsonData = data;
//         console.log(geojsonData)
//     })
//     .catch(err => console.error('Errorr: ', err));


// interactivity ----------------------

// let clicks = 1
// function onMapClick(e) {
//     // alert("You clicked the map at " + e.latlng);

//     if (clicks == 1){

//         markersGroup.clearLayers();
    
//         geojsonData.features.forEach(function(feature) {
    
//             let size = 10
    
//             // let marker = L.marker([coords[1], coords[0]]);
//             let coords = feature.geometry.coordinates;
    
//             if (feature.properties.mag != undefined && feature.properties.mag > 0){
//                 size = Math.sqrt(feature.properties.mag) * 5
//             } 
//             // console.log(feature.properties.place, feature.properties.mag)
    
//             let bubble = L.circleMarker([coords[1], coords[0]], {
//                 color: 'blue',
//                 fillColor: 'lightblue',
//                 fillOpacity: 0.5,
//                 radius: size
//                 })
    
//             bubble.bindPopup(feature.properties.place + ', ' + feature.properties.mag);
//             markersGroup.addLayer(bubble);
    
//         })
    
//         map.fitBounds(markersGroup.getBounds());
//     }

//     clicks += 1
// }

// map.on('click', onMapClick);

// let popup = L.popup();
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent(e.latlng.toString())
//         .openOn(map);
// }