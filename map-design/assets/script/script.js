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

let map = L.map('map', {
    // renderer: L.canvas(),
    center: [45.873673081319794, 8.979357135658603],
    zoom: 13
});

// let wmsLayer = L.tileLayer.wms(
//   "https://wmts.geo.admin.ch/EPSG/4326/1.0.0/WMTSCapabilities.xml",
//   {
//     layers: "TOPO-OSM-WMS"
//   }
// );

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    .addTo(map);


// markers ----------------------

let marker1 = L.marker([45.87, 8.97])
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    // .addTo(map)

let marker2 = L.marker([45.86, 8.96])
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    // .addTo(map)

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
    ])
    .addTo(map);

// layers ----------------------

let layer = L.featureGroup([marker1, marker2])
layer.addTo(map);
// console.log(layer)

// interactivity ----------------------

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

// map.on('click', onMapClick);

let popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}